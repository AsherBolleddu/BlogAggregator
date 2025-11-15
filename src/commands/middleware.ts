import { readConfig } from "../config";
import { User } from "../lib/db/schema";
import { CommandHandler } from "./commands";
import { getUserByName } from "../lib/db/queries/users";

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(
  handler: UserCommandHandler
): CommandHandler {
  return async (cmdName, ...args) => {
    const user = await getUserByName(readConfig().currentUserName);
    if (!user) {
      throw new Error(`User ${readConfig().currentUserName} not found`);
    }
    return handler(cmdName, user, ...args);
  };
}
