export type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
): void {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): void {
  const func = registry[cmdName];
  if (!func) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  func(cmdName, ...args);
}
