import { getFeedByUrl } from "../lib/db/queries/feeds";
import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feedfollows";
import { UserCommandHandler } from "./middleware";

export const handlerFollow: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];
  const feed = await getFeedByUrl(url);

  if (!feed) {
    throw new Error("Feed doesn't exist, addfeed first");
  }

  const feedFollows = await createFeedFollow(user.id, feed.id);
  console.log(`* ID:            ${feedFollows.id}`);
  console.log(`* Created:       ${feedFollows.createdAt}`);
  console.log(`* Updated:       ${feedFollows.updatedAt}`);
  console.log(`* name:          ${feedFollows.feedName}`);
  console.log(`* User:          ${feedFollows.userName}`);
};

export const handlerFollowing: UserCommandHandler = async (_, user) => {
  const feedFollowsForUser = await getFeedFollowsForUser(user.id);
  if (!feedFollowsForUser) {
    throw new Error("Error getting feed follows for user");
  }
  feedFollowsForUser.forEach((item) => {
    console.log(`${item.userName}: ${item.feedName}`);
  });
};

export const handlerUnfollow: UserCommandHandler = async (
  cmdName,
  user,
  ...args
) => {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];

  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed not found for url: ${url}`);
  }

  const result = await deleteFeedFollow(user.id, feed.id);
  if (!result) {
    throw new Error(`Failed to unfollow feed: ${url}`);
  }
  console.log(`${feed.name} unfollowed successfully`);
};
