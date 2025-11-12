import { type CommandHandler } from "./commands";
import { setUser } from "../config";
import { createUser, getUser } from "../lib/db/queries/users";

export const handlerLogin: CommandHandler = async (cmdName, ...args) => {
  if (args.length < 1 || !args[0].trim()) {
    // console.error("username required");
    // process.exit(1);
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const result = await getUser(args[0].trim());
  //   console.log("User has been set");
  setUser(result.name);
  console.log("User switched successfully");
};

export const handlerRegister: CommandHandler = async (cmdName, ...args) => {
  if (args.length < 1 || !args[0].trim()) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const result = await createUser(args[0].trim());
  console.log(`User ${result.name} registered successfully`);
  console.log(result);
  setUser(result.name);
};
