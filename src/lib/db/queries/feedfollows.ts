import { feed_follows, feeds, users } from "../schema";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { getFeedByUrl } from "./feeds";

export async function createFeedFollow(user_id: string, feed_id: string) {
  const [result] = await db
    .insert(feed_follows)
    .values({ user_id, feed_id })
    .onConflictDoNothing({
      target: [feed_follows.feed_id, feed_follows.user_id],
    })
    .returning();

  const [getRelatedFeeds] = await db
    .select({
      id: feed_follows.id,
      createdAt: feed_follows.createdAt,
      updatedAt: feed_follows.updatedAt,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feed_follows)
    .innerJoin(feeds, eq(feeds.id, feed_follows.feed_id))
    .innerJoin(users, eq(users.id, feed_follows.user_id))
    .where(eq(feed_follows.id, result.id));

  return getRelatedFeeds;
}

export async function getFeedFollowsForUser(user_id: string) {
  const result = await db
    .select({
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feed_follows)
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .innerJoin(feeds, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.user_id, user_id));

  return result;
}

export async function deleteFeedFollow(user_id: string, feed_id: string) {
  const [result] = await db
    .delete(feed_follows)
    .where(
      and(eq(feed_follows.user_id, user_id), eq(feed_follows.feed_id, feed_id))
    )
    .returning();

  return result;
}
