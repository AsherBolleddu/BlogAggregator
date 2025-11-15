import { getFeedByUrl } from "../lib/db/queries/feeds";
import { CommandHandler } from "./commands";
import { getUserByName } from "../lib/db/queries/users";
import { readConfig } from "../config";
import { createFeedFollow } from "../lib/db/queries/feedfollows";

export const handlerFollow: CommandHandler = async (cmdName, ...args) => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];
  const feed = await getFeedByUrl(url);

  if (!feed) {
    throw new Error("Feed doesn't exist, addfeed first");
  }

  const user = await getUserByName(readConfig().currentUserName);

  if (!user) {
    throw new Error("User doesn't exist, register user first");
  }

  const feedFollows = await createFeedFollow(user.id, feed.id);
  console.log(`* ID:            ${feedFollows.id}`);
  console.log(`* Created:       ${feedFollows.createdAt}`);
  console.log(`* Updated:       ${feedFollows.updatedAt}`);
  console.log(`* name:          ${feedFollows.feedName}`);
  console.log(`* User:          ${feedFollows.userName}`);
};
