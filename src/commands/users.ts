import { type CommandHandler } from "./commands";
import { setUser } from "../config";

export const handlerLogin: CommandHandler = (cmdName, ...args) => {
  if (args.length < 1 || !args[0].trim()) {
    // console.error("username required");
    // process.exit(1);
    throw new Error(`usage: ${cmdName} <name>`);
  }
  setUser(args[0].trim());
  //   console.log("User has been set");
  console.log("User switched successfully");
};
