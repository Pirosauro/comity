import type { CliExecutionFacade, CliCommand, CliCommandArgs } from "@comity/cli";
import type { Command } from "commander";

import { CommanderError } from "commander";
import { toCommanderCommand } from "./internal/commands.js";

/**
 * Options for creating a Commander adapter.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through the CLI execution facade.
 *
 * @remarks
 * The adapter receives its complete input explicitly: an application-owned
 * Commander program and the composed Core CLI execution facade. It never discovers
 * configuration, never accesses the filesystem or process, and never assumes
 * an application layout.
 */
export interface CommanderAdapterOptions<Context = {}> {
  /** Application-owned Commander program (name, version, help, output) */
  program: Command;

  /** Core CLI execution facade to translate and execute */
  facade: CliExecutionFacade<Context>;
}

/**
 * Commander adapter surface.
 *
 * @remarks
 * Translates Core command execution into Commander parsing. The adapter owns
 * no branding, no configuration, no filesystem access, and no process
 * behavior: it returns exit codes and lets the caller decide.
 */
export interface CommanderAdapter {
  /**
   * Run the CLI with the given user arguments.
   *
   * @param argv - User arguments (without the executable and script)
   *
   * @returns The exit code suggested by Commander (0 = success, 1 = error)
   */
  run(argv?: string[]): Promise<number>;
}

/**
 * Creates a Commander adapter for a Core CLI execution facade.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through the CLI execution facade.
 *
 * @param options - Explicit adapter options (application-owned program and
 *   Core CLI execution facade)
 *
 * @returns The Commander adapter
 *
 * @remarks
 * Binds the Core CLI to Commander.js as a thin translation layer:
 *
 * ```
 * Core command contract
 *   ↓
 * Commander representation
 *   ↓
 * Commander execution
 *   ↓
 * Core command execution
 * ```
 *
 * No configuration is discovered from files or the environment; nothing is
 * assumed about the executable, the working directory, or the application
 * layout. The application passes its own Commander program (branding is the
 * application's choice) and the composed Core facade. `run` never calls
 * `process.exit`; the application owns process exit behavior.
 *
 * @example
 * ```ts
 * import { Command } from "commander";
 * import { CommandRegistry, CliExecutionFacade } from "@comity/cli";
 * import { createCommanderAdapter } from "@comity/cli-commander";
 *
 * const registry = new CommandRegistry<AppContext>();
 * // ... register commands ...
 *
 * const facade = new CliExecutionFacade(registry, hooks, events, appContext);
 *
 * const program = new Command().name("my-cli").version("1.0.0");
 * const adapter = createCommanderAdapter({ program, facade });
 *
 * process.exitCode = await adapter.run(process.argv.slice(2));
 * ```
 */
export function createCommanderAdapter<Context = {}>(
  options: CommanderAdapterOptions<Context>
): CommanderAdapter {
  const { program, facade } = options;

  program.exitOverride();

  // Get commands from the facade (available in all lifecycle states)
  const commands = facade.commands();

  for (const command of commands) {
    toCommanderCommand(command, program, facade);
  }

  return {
    /** @inheritdoc */
    async run(argv: string[] = []): Promise<number> {
      try {
        await program.parseAsync(argv, { from: "user" });

        return 0;
      } catch (error) {
        if (error instanceof CommanderError) {
          return error.exitCode ?? 1;
        }

        const message = error instanceof Error ? error.message : String(error);

        try {
          program.error(message, { exitCode: 1 });
        } catch (forwarded) {
          if (forwarded instanceof CommanderError) {
            return forwarded.exitCode ?? 1;
          }
        }

        return 1;
      }
    },
  };
}