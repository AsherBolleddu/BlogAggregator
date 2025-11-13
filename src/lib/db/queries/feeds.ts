import { db } from "..";
import { feeds } from "../schema";

export async function createFeed(name: string, url: string, user_id: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, user_id })
    .onConflictDoNothing({
      target: feeds.url,
    })
    .returning();
  return result;
}

export async function getFeeds() {
  return db.select().from(feeds);
}
