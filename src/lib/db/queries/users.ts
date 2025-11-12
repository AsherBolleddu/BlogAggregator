import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db
    .insert(users)
    .values({ name })
    .onConflictDoNothing({
      target: users.name,
    })
    .returning();
  return result;
}

export async function getUsers() {
  return db.select().from(users);
}

export async function getUser(name: string) {
  const [result] = await db
    .select({
      name: users.name,
    })
    .from(users)
    .where(eq(users.name, name));
  // .where(sql`${name} = ${users.name}`);
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}
