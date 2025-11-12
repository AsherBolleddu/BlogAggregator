import { sql } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  try {
    const [result] = await db
      .insert(users)
      .values({ name })
      .onConflictDoNothing({
        target: users.name,
      })
      .returning();

    if (!result) {
      throw new Error("User already exists");
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export async function getUser(name: string) {
  try {
    const [result] = await db
      .select({
        name: users.name,
      })
      .from(users)
      .where(sql`${name} = ${users.name}`);

    if (!result) {
      throw new Error("User does not exist");
    }

    return result;
  } catch (error) {
    throw error;
  }
}
