import type { Result } from "@comity/primitives/result";
import type { CliError } from "../errors/cli.js";
import type { CliCommand, CliCommandArgs } from "./command.js";
import type { CliHookHandler, CliLifecycle } from "./hook.js";
import type { CliPlugin } from "./plugin.js";

/**
 * CLI composition facade contract.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through `createCli`.
 *
 * @remarks
 * The facade through which commands, plugins, and hooks are composed, and
 * through which commands are executed. It is the single public composition
 * surface of the CLI Core; the canonical implementation is provided by
 * {@link createCli}. Adapters consume this contract directly.
 */
export interface Cli<Context = {}> {
  /**
   * Register a command.
   *
   * @param command - Command to register
   *
   * @throws {CliError} If a command with the same name is already registered
   */
  command(command: CliCommand<Context>): void;

  /**
   * Register a plugin.
   *
   * @param plugin - Setup-based plugin to invoke
   */
  plugin(plugin: CliPlugin<Context>): void;

  /**
   * Register a lifecycle hook handler.
   *
   * @param name - Lifecycle hook name
   * @param handler - Hook handler
   */
  hook(name: keyof CliLifecycle<Context>, handler: CliHookHandler<Context>): void;

  /**
   * Get all registered commands in registration order.
   *
   * @returns Registered commands
   */
  commands(): readonly CliCommand<Context>[];

  /**
   * Execute a command by name.
   *
   * @param name - Registered command name
   * @param args - Parsed command arguments
   *
   * @returns Result of the command execution
   */
  execute(name: string, args: CliCommandArgs): Promise<Result<void, CliError>>;
}

/**
 * Options for creating a CLI instance.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time.
 *
 * @remarks
 * The application owns the execution context and supplies it explicitly at
 * composition time. The Core never discovers or loads configuration; it uses
 * exactly what is supplied here.
 */
export type CliOptions<Context = {}> = Readonly<{
  /** Application-owned execution context injected into every command run */
  context: Context;
}>;
