import { readConfig, setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

const handlerLogin: CommandHandler = (cmdName, ...args) => {
  if (args.length <= 0) {
    throw new Error("username required");
  }
  setUser(args[0]);
  console.log("User has been set");
};

type CommandsRegistry = Record<string, CommandHandler>;
function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler;
  return registry;
}

function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const func = registry[cmdName];
  func(cmdName, ...args);
}

function main() {
  const args = process.argv.slice(2);
  const commandsRegistry: CommandsRegistry = {};
  registerCommand(commandsRegistry, "login", handlerLogin());
  // setUser("Asher");
  // process.argv.forEach((arg) => console.log(arg));
  // console.log(args);
  const cfg = readConfig();
  console.log(cfg);
}

main();
