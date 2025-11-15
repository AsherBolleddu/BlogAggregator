import { CommandHandler } from "./commands";
import { fetchFeed } from "../lib/rss";
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { Feed, NewPost } from "src/lib/db/schema";
import { createPost } from "src/lib/db/queries/posts";

export const handlerAgg: CommandHandler = async (cmdName, ...args) => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }
  const milliseconds = parseDuration(args[0]);

  console.log(`Collecting feeds every ${args[0]}`);
  scrapeFeeds().catch((error) => {
    console.error(`No feed found: ${error}`);
    return;
  });

  const id = setInterval(() => {
    scrapeFeeds().catch((error) => {
      console.error(`No feed found: ${error}`);
      return;
    });
  }, milliseconds);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(id);
      resolve();
    });
  });
};

export const scrapeFeeds = async () => {
  const nextFeed = await getNextFeedToFetch();
  if (!nextFeed) {
    throw new Error("Error in scrapeFeeds getting nextFeed");
  }
  const markFetchedFeed = await markFeedFetched(nextFeed.id);
  if (!markFetchedFeed) {
    throw new Error("error in scrapeFeeds marking fetched feed");
  }
  const fetchedFeeds = await fetchFeed(nextFeed.url);
  if (!fetchedFeeds) {
    throw new Error("error in scrapeFeeds getting fetchedFeeds");
  }

  fetchedFeeds.channel.item?.forEach(async (item) => {
    console.log(`Found post: %s`, item.title);

    const now = new Date();

    await createPost({
      url: item.link,
      feedId: nextFeed.id,
      title: item.title,
      createdAt: now,
      updatedAt: now,
      description: item.description,
      publishedAt: new Date(item.pubDate),
    } satisfies NewPost);
  });
};

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error("Invalid duration: " + durationStr);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      throw new Error("Unexpected unit");
  }
}
