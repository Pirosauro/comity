import type { Cli, CliOptions } from "./contracts/cli.js";
import type { CliLifecycle } from "./contracts/hook.js";

import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { CommandExecutor } from "./internal/command-executor.js";
import { CommandRegistry } from "./internal/command-registry.js";

/**
 * Create a CLI composition facade.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time.
 *
 * @param options - Explicit composition options
 *
 * @returns The composed CLI facade
 *
 * @remarks
 * The canonical implementation of the {@link Cli} contract. Composition is
 * explicit and application-owned: the execution context is supplied at
 * creation time, commands and hooks are registered through the facade, and
 * nothing is discovered from the environment. The factory is
 * runtime-agnostic and safe to use without any Node.js or CLI technology.
 *
 * @example
 * ```ts
 * interface MyContext {
 *   config: { apiUrl: string };
 * }
 *
 * const cli = createCli<MyContext>({
 *   context: { config: { apiUrl: "https://api.example.com" } },
 * });
 *
 * cli.command({
 *   name: "build",
 *   action: async (args, ctx) => {
 *     await deploy(ctx.config.apiUrl);
 *   },
 * });
 * ```
 */
export function createCli<Context = {}>(options: CliOptions<Context>): Cli<Context> {
  const registry = new CommandRegistry<Context>();
  const lifecycle = new DefaultHookBus<CliLifecycle<Context>>();
  const executor = new CommandExecutor(registry, lifecycle, options.context);

  const cli: Cli<Context> = {
    /** @inheritdoc */
    command: (command) => registry.register(command),
    /** @inheritdoc */
    plugin: (plugin) => plugin(cli),
    /** @inheritdoc */
    hook: (name, handler) => lifecycle.define(name, handler),
    /** @inheritdoc */
    commands: () => registry.all(),
    /** @inheritdoc */
    execute: (name, args) => executor.execute(name, args),
  };

  return cli;
}
