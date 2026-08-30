import type { HookBus } from "@comity/primitives/lifecycle";
import type { Result } from "@comity/primitives/result";
import type { CliCommandArgs } from "../contracts/command.js";
import type { CliCommandRun, CliLifecycle } from "../contracts/hook.js";
import type { CliErrorMeta } from "../errors/cli.js";
import type { CommandRegistry } from "./command-registry.js";

import { failure, success } from "@comity/primitives/result";
import { CliError } from "../errors/cli.js";

/**
 * Normalizes an unknown thrown value into a message string.
 *
 * @param error - The thrown value
 *
 * @returns The error message
 */
function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Command executor.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through `createCli`.
 *
 * @remarks
 * Orchestrates a single command execution through the CLI lifecycle:
 * `beforeCommand` hooks, the command action, and `afterCommand` hooks.
 * Thrown action/hook errors are normalized into `Result` failures carrying a
 * {@link CliError}; the executor never throws for execution failures.
 */
export class CommandExecutor<Context = {}> {
  /** Command registry */
  readonly #registry: CommandRegistry<Context>;
  /** Lifecycle hook bus */
  readonly #hooks: HookBus<CliLifecycle<Context>>;
  /** Injected execution context */
  readonly #context: Context;

  /**
   * @param registry - Command registry to resolve commands from
   * @param hooks - Lifecycle hook bus
   * @param context - Execution context injected into every run
   */
  constructor(
    registry: CommandRegistry<Context>,
    hooks: HookBus<CliLifecycle<Context>>,
    context: Context
  ) {
    this.#registry = registry;
    this.#hooks = hooks;
    this.#context = context;
  }

  /**
   * Execute a command by name.
   *
   * @param name - Registered command name
   * @param args - Parsed command arguments
   *
   * @returns Result of the command execution
   */
  async execute(name: string, args: CliCommandArgs): Promise<Result<void, CliError>> {
    const command = this.#registry.get(name);

    if (!command) {
      return failure(new CliError("command_not_found", { details: { name } }));
    }

    const run: CliCommandRun<Context> = { name, args, context: this.#context };

    let prepared: CliCommandRun<Context>;

    try {
      prepared = await this.#hooks.execute("beforeCommand", run);
    } catch (error) {
      return failure(
        new CliError("hook_failed", { cause: error, details: { hook: "beforeCommand" } })
      );
    }

    try {
      await command.action(prepared.args, prepared.context);
    } catch (error) {
      const afterError = await this.#runAfterHooks(prepared);
      const meta: CliErrorMeta = afterError
        ? { cause: error, details: { afterCommandError: toMessage(afterError) } }
        : { cause: error };

      return failure(new CliError("command_failed", meta));
    }

    try {
      await this.#hooks.execute("afterCommand", prepared);
    } catch (error) {
      return failure(
        new CliError("hook_failed", { cause: error, details: { hook: "afterCommand" } })
      );
    }

    return success(undefined);
  }

  /**
   * Best-effort execution of `afterCommand` hooks after a failed action.
   *
   * @param run - The executed command run
   *
   * @returns The thrown hook error, or `undefined` when hooks succeed
   */
  async #runAfterHooks(run: CliCommandRun<Context>): Promise<unknown> {
    try {
      await this.#hooks.execute("afterCommand", run);

      return undefined;
    } catch (error) {
      return error;
    }
  }
}
