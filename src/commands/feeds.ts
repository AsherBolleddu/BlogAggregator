import { getUserById } from "../lib/db/queries/users";
import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";
import { CommandHandler } from "./commands";
import { createFeedFollow } from "../lib/db/queries/feedfollows";
import { UserCommandHandler } from "./middleware";

export const handlerAddFeed: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error("Failed creating Feed");
  }

  const feedFollowCreating = await createFeedFollow(user.id, feed.id);
  if (!feedFollowCreating) {
    throw new Error("Failed creating feed follow in hanlderAddFeed");
  }

  console.log("Feed created successfully:");
  printFeed(feed, user);
};

export const handlerListFeeds: CommandHandler = async () => {
  const feeds = await getFeeds();

  if (!feeds.length) {
    throw new Error("No feeds exist");
  }

  for (let i = 0; i < feeds.length; i++) {
    const feed = feeds[i];
    const user = await getUserById(feed.user_id);

    if (!user) {
      throw new Error(`User not found for ${feed.user_id}`);
    }

    console.log(`* name:          ${feed.name}`);
    console.log(`* URL:           ${feed.url}`);
    console.log(`* User:          ${user.name}`);

    if (i < feeds.length - 1) {
      console.log();
    }
  }
};

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}
