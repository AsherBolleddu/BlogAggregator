import { deleteUsers } from "../lib/db/queries/users";
import { type CommandHandler } from "./commands";

export const handlerReset: CommandHandler = async (_) => {
  await deleteUsers();
  console.log("Database reset successfully!");
};
