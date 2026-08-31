import type { HookBus } from "@comity/primitives/lifecycle";
import type { EventBus } from "@comity/primitives/lifecycle";
import type { Result } from "@comity/primitives/result";
import type { BaseError } from "@comity/primitives/errors";
import type { CliCommandArgs, CliCommandContext } from "../contracts/command.js";
import type { CliCommandRun, CliLifecycle } from "../contracts/hook.js";
import type { CliErrorMeta } from "../errors/cli.js";
import type { CommandRegistry } from "./command-registry.js";

import { failure, success } from "@comity/primitives/result";
import { CliError } from "../errors/cli.js";

/**
 * Normalizes an unknown thrown value into a message string.
 * 
 * @param error - The thrown value
 * @returns The error message
 */
function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Event emitter interface for the executor with proper overloads.
 */
interface ExecutorEvents {
  emit(event: "cli.command.started", payload: { name: string; args: CliCommandArgs; context: CliCommandContext }): void;
  emit(event: "cli.command.completed", payload: { name: string; args: CliCommandArgs; context: CliCommandContext; durationMs: number }): void;
  emit(event: "cli.command.failed", payload: { name: string; args: CliCommandArgs; context: CliCommandContext; error: Error; durationMs: number }): void;
}

/**
 * Command executor.
 * 
 * @typeParam Context - Application-defined context shape.
 * 
 * @remarks
 * Orchestrates a single command execution through the CLI lifecycle:
 * `beforeCommand` hooks, the command action, and `afterCommand` hooks.
 * Thrown action/hook errors are normalized into `Result` failures carrying a
 * {@link CliError}; the executor never throws for execution failures.
 * Events are emitted for observability.
 */
export class CommandExecutor<Context = {}> {
  readonly #registry: CommandRegistry<Context>;
  readonly #hooks: HookBus<CliLifecycle<Context>>;
  readonly #context: Context;
  readonly #events: ExecutorEvents | undefined;

  /**
   * @param registry - Command registry to resolve commands from
   * @param hooks - Lifecycle hook bus (from Composition kernel)
   * @param context - Execution context injected into every run
   * @param events - Optional event emitter for observability
   */
  constructor(
    registry: CommandRegistry<Context>,
    hooks: HookBus<CliLifecycle<Context>>,
    context: Context,
    events?: ExecutorEvents
  ) {
    this.#registry = registry;
    this.#hooks = hooks;
    this.#context = context;
    this.#events = events;
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

    const run: CliCommandRun<Context> = { name, args, context: this.#context as CliCommandContext<Context> };
    const startTime = Date.now();

    // Emit command started event
    this.#events?.emit("cli.command.started", { name, args, context: run.context });

    let prepared: CliCommandRun<Context>;

    try {
      prepared = await this.#hooks.execute("beforeCommand", run);
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const err = error instanceof Error ? error : new Error(String(error));
      this.#events?.emit("cli.command.failed", { name, args, context: run.context, error: err, durationMs });

      return failure(
        new CliError("hook_failed", { cause: error, details: { hook: "beforeCommand" } })
      );
    }

    try {
      const actionResult = await command.action(prepared.args, prepared.context);

      // Handle Result return from action
      if (actionResult && typeof actionResult === "object" && "success" in actionResult) {
        const result = actionResult as Result<void, BaseError>;
        if (!result.success) {
          const durationMs = Date.now() - startTime;
          const err = result.error instanceof Error ? result.error : new Error(String(result.error));
          this.#events?.emit("cli.command.failed", {
            name,
            args,
            context: prepared.context,
            error: err,
            durationMs,
          });

          // Still run afterCommand hooks on action failure
          try {
            await this.#hooks.execute("afterCommand", prepared);
          } catch (hookError) {
            // Hook error during cleanup - log but don't override action failure
          }

          return failure(
            new CliError("command_failed", { cause: result.error })
          );
        }
      }
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const err = error instanceof Error ? error : new Error(String(error));
      this.#events?.emit("cli.command.failed", { name, args, context: prepared.context, error: err, durationMs });

      // Best-effort execution of afterCommand hooks after a failed action
      try {
        await this.#hooks.execute("afterCommand", prepared);
      } catch (hookError) {
        // Hook error during cleanup - log but don't override action failure
      }

      return failure(new CliError("command_failed", { cause: error }));
    }

    try {
      await this.#hooks.execute("afterCommand", prepared);
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const err = error instanceof Error ? error : new Error(String(error));
      this.#events?.emit("cli.command.failed", { name, args, context: prepared.context, error: err, durationMs });

      return failure(
        new CliError("hook_failed", { cause: error, details: { hook: "afterCommand" } })
      );
    }

    const durationMs = Date.now() - startTime;
    this.#events?.emit("cli.command.completed", { name, args, context: prepared.context, durationMs });

    return success(undefined);
  }
}