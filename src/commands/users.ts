import { type CommandHandler } from "./commands";
import { readConfig, setUser } from "../config";
import { createUser, getUserByName, getUsers } from "../lib/db/queries/users";

export const handlerLogin: CommandHandler = async (cmdName, ...args) => {
  if (args.length != 1 || !args[0].trim()) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const name = args[0].trim();
  try {
    const result = await getUserByName(name);

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
  if (args.length !== 1 || !args[0].trim()) {
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

export const handlerListUsers: CommandHandler = async (_) => {
  try {
    const results = await getUsers();

    if (!results.length) {
      throw new Error("No users exist, please register a user");
    }

    const config = readConfig();

    results.forEach((users) => {
      console.log(
        `* ${users.name}${
          users.name === config.currentUserName ? ` (current)` : ""
        }`
      );
    });
  } catch (error) {
    throw error;
  }
};
