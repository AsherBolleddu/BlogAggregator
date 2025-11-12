import { type CommandHandler } from "./commands";
import { setUser } from "../config";
import { createUser, getUser } from "../lib/db/queries/users";

export const handlerLogin: CommandHandler = async (cmdName, ...args) => {
  if (args.length < 1 || !args[0].trim()) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const name = args[0].trim();
  try {
    const result = await getUser(name);

    if (!result) {
      throw new Error("User does not exist");
    }

    setUser(result.name);
    console.log("User switched successfully");
  } catch (error) {
    throw error;
  }
};

export const handlerRegister: CommandHandler = async (cmdName, ...args) => {
  if (args.length < 1 || !args[0].trim()) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const name = args[0].trim();
  try {
    const result = await createUser(name);

    if (!result) {
      throw new Error("User already exists");
    }

    setUser(result.name);
    console.log(`User ${result.name} registered successfully`);
  } catch (error) {
    throw error;
  }
};
