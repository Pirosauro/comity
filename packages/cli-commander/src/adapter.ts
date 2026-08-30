import type { Cli } from "@comity/cli";
import type { Command } from "commander";

import { CommanderError } from "commander";
import { toCommanderCommand } from "./internal/commands.js";

/**
 * Options for creating a Commander adapter.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through `createCli`.
 *
 * @remarks
 * The adapter receives its complete input explicitly: an application-owned
 * Commander program and the composed Core CLI facade. It never discovers
 * configuration, never accesses the filesystem or process, and never assumes
 * an application layout.
 */
export interface CommanderAdapterOptions<Context = {}> {
  /** Application-owned Commander program (name, version, help, output) */
  program: Command;

  /** Core CLI facade to translate and execute */
  cli: Cli<Context>;
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
 * Creates a Commander adapter for a Core CLI facade.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through `createCli`.
 *
 * @param options - Explicit adapter options (application-owned program and
 *   Core CLI facade)
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
 * import { createCli } from "@comity/cli";
 * import { createCommanderAdapter } from "@comity/cli-commander";
 *
 * const cli = createCli({ context: appContext });
 * cli.command({ name: "build", action: buildAction });
 *
 * const program = new Command().name("my-cli").version("1.0.0");
 * const adapter = createCommanderAdapter({ program, cli });
 *
 * process.exitCode = await adapter.run(process.argv.slice(2));
 * ```
 */
export function createCommanderAdapter<Context = {}>(
  options: CommanderAdapterOptions<Context>
): CommanderAdapter {
  const { program, cli } = options;

  program.exitOverride();

  for (const command of cli.commands()) {
    toCommanderCommand(command, program, cli);
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
