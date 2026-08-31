import type { EventBus, HookBus } from "@comity/primitives/lifecycle";
import type { Result } from "@comity/primitives/result";
import type { CliCommand, CliCommandArgs } from "../contracts/command.js";
import type { CliEvents } from "../contracts/event.js";
import type { CliLifecycle } from "../contracts/hook.js";
import type { CliError } from "../errors/cli.js";
import type { CommandRegistry } from "./command-registry.js";

import { CommandExecutor } from "./command-executor.js";

/**
 * CLI execution facade.
 *
 * @typeParam Context - Application-defined context shape.
 *
 * @remarks
 * This is a thin wrapper around the command registry and executor that uses
 * the Composition kernel's HookBus and EventBus. It does NOT have its own
 * lifecycle - it uses the Composition kernel's lifecycle.
 *
 * The Application creates this facade after Composition has completed setup,
 * and uses it to execute commands through the technology adapter.
 */
export class CliExecutionFacade<Context = {}> {
  readonly #registry: CommandRegistry<Context>;
  readonly #executor: CommandExecutor<Context>;

  /**
   * @param registry - Command registry populated during Composition setup
   * @param hooks - Hook bus from Composition kernel
   * @param events - Event bus from Composition kernel
   * @param context - Application context injected into every command run
   */
  constructor(
    registry: CommandRegistry<Context>,
    hooks: HookBus<CliLifecycle<Context>>,
    events: EventBus<CliEvents<Context>>,
    context: Context
  ) {
    this.#registry = registry;

    // Create executor with the Composition kernel's HookBus and EventBus
    this.#executor = new CommandExecutor<Context>(registry, hooks, context, {
      /**
       *
       * @param event
       * @param payload
       */
      emit: (event: keyof CliEvents<Context>, payload: unknown) => {
        // Emit events through the Composition kernel's EventBus
        return events.emit(event, payload);
      },
    });
  }

  /**
   * Get all registered commands in registration order.
   *
   * @returns Registered commands
   */
  commands(): readonly CliCommand<Context>[] {
    return this.#registry.all();
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
    return this.#executor.execute(name, args);
  }
}

/**
 * Create a CLI execution facade from a command registry and Composition kernel infrastructure.
 *
 * @param registry - Command registry populated during Composition setup
 * @param hooks - Hook bus from Composition kernel
 * @param events - Event bus from Composition kernel
 * @param context - Application context injected into every command run
 *
 * @returns A CLI execution facade ready for command execution
 *
 * @remarks
 * The CLI execution facade is created AFTER Composition has completed setup and the
 * command registry has been populated by modules during their setup phase.
 * It does NOT have its own lifecycle - it uses the Composition kernel's
 * lifecycle and infrastructure.
 */
export function createCliExecutionFacade<Context = {}>(
  registry: CommandRegistry<Context>,
  hooks: HookBus<CliLifecycle<Context>>,
  events: EventBus<CliEvents<Context>>,
  context: Context
): CliExecutionFacade<Context> {
  return new CliExecutionFacade(registry, hooks, events, context);
}
