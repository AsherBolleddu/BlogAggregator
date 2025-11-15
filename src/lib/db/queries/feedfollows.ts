import { feed_follows, feeds, users } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export async function createFeedFollow(user_id: string, feed_id: string) {
  const [result] = await db
    .insert(feed_follows)
    .values({ user_id, feed_id })
    .onConflictDoNothing({
      target: [feed_follows.feed_id, feed_follows.user_id],
    })
    .returning();

  console.log(result);

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
    .innerJoin(users, eq(users.id, feed_follows.user_id));

  console.log(getRelatedFeeds);
  return getRelatedFeeds;
}

export async function getFeedFollowsForUser(name: string) {}
