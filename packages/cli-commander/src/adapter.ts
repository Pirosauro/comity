import { Command } from "commander";
import type { CliContext, CliConfig, CliCommand, CliConfigLoader, Logger, HookContext } from "@comity/cli";
import type { CommanderAdapterOptions } from "./types.js";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

/**
 * Default configuration search paths.
 */
const DEFAULT_CONFIG_PATHS = [
  "comity.config.ts",
  "comity.config.js",
  "config/comity.config.ts",
  "config/comity.config.js",
];

/**
 * Filesystem configuration loader implementation.
 *
 * @param workingDirectory - Directory to search for config files
 *
 * @returns Config loader instance
 *
 * @remarks
 * Searches for config files in standard locations and loads them
 * using dynamic import. Supports both TypeScript and JavaScript configs.
 */
export function createFileSystemConfigLoader(workingDirectory: string): CliConfigLoader {
  return {
    /**
     * Load the CLI configuration.
     *
     * @returns Resolved CLI configuration
     */
    async load(): Promise<CliConfig> {
      const paths = DEFAULT_CONFIG_PATHS.map((p) => join(workingDirectory, p));

      for (const path of paths) {
        try {
          const url = pathToFileURL(path).href;
          const { default: config } = await import(url);

          if (config && typeof config === "object") {
            return config;
          }
        } catch {
          // Continue to next path
        }
      }

      // Return empty config if no config file found
      return {};
    },
  };
}

/**
 * Maps Core command options to Commander options.
 *
 * @param command - Core command definition
 * @param commanderCommand - Commander command instance
 */
function mapOptionsToCommander(command: CliCommand, commanderCommand: Command): void {
  command.options?.forEach((option) => {
    commanderCommand.option(option.flags, option.description, option.default as string | boolean | string[] | undefined);
  });
}

/**
 * Creates a Commander adapter for the given CliContext.
 *
 * @param options - Adapter configuration
 *
 * @returns Object with `run` method to execute the CLI
 */
export function createCommanderAdapter(options: CommanderAdapterOptions): {
  /**
   * Run the CLI with the given arguments.
   *
   * @param argv - Command-line arguments (defaults to process.argv.slice(2))
   *
   * @returns Exit code (0 = success, 1 = error, 2 = usage)
   */
  run: (argv?: string[]) => Promise<number>;
} {
  const { name, version, context, configLoader, logger } = options;

  /**
   * Default logger that uses console if no logger provided.
   */
  const defaultLogger: Logger = {
    /**
     * Informational message
     *
     * @param message - Informational message
     * @param meta - Optional metadata
     *
     * @returns void
     */
    info: (message: string, meta?: Record<string, unknown>) => console.log(message, meta ?? ""),
    /**
     * Error message
     *
     * @param message - Error message
     * @param meta - Optional metadata
     *
     * @returns void
     */
    error: (message: string, meta?: Record<string, unknown>) => console.error(message, meta ?? ""),
    /**
     * Debug message
     *
     * @param message - Debug message
     * @param meta - Optional metadata
     *
     * @returns void
     */
    debug: (message: string, meta?: Record<string, unknown>) => console.debug(message, meta ?? ""),
  };

  const activeLogger = logger ?? defaultLogger;

  /**
   * Execute the CLI with the given arguments.
   *
   * @param argv - Command-line arguments (defaults to process.argv.slice(2))
   *
   * @returns Exit code (0 = success, 1 = error, 2 = usage)
   */
  async function run(argv: string[] = process.argv.slice(2)): Promise<number> {
    const program = new Command();

    program.name(name).version(version);

    // Register all commands from context
    context.getAllCommands().forEach((command) => {
      const cmd = program.command(command.name);

      if (command.description) {
        cmd.description(command.description);
      }

      mapOptionsToCommander(command, cmd);

      // Wrap action with hook execution
      // Commander calls action with: (parsedOptions, command)
      cmd.action(async (parsedOptions: Record<string, unknown>, commanderCommand: Command) => {
        // Extract only the user-provided options (exclude Commander internals)
        const parsedArgs: Record<string, unknown> = {};
        for (const key of Object.keys(parsedOptions)) {
          if (!key.startsWith("_")) {
            parsedArgs[key] = parsedOptions[key];
          }
        }

        const hookContext: HookContext = {
          commandName: command.name,
          args: parsedArgs,
          config: context.getConfig(),
          logger: activeLogger,
        };

        await context.executeHook("beforeCommand", hookContext);

        try {
          const cmdContext = {
            config: context.getConfig(),
            logger: activeLogger,
          };
          await command.action(parsedArgs, cmdContext);
        } finally {
          await context.executeHook("afterCommand", hookContext);
        }
      });
    });

    // Override Commander's default error handling to avoid process.exit
    program.exitOverride((err) => {
      if (err.code === "commander.unknownCommand") {
        activeLogger.error(`Unknown command: ${err.message}`);
      } else {
        activeLogger.error(`Command error: ${err.message}`);
      }
      // Don't exit, we'll return the exit code
    });

    try {
      // Parse arguments programmatically to avoid process.exit
      await program.parseAsync(argv, { from: "user" });
      const exitCode = process.exitCode;
      return typeof exitCode === "number" ? exitCode : 0;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Commander throws for unknown commands even with exitOverride
      if (message.includes("unknown command")) {
        return 2;
      }
      activeLogger.error(`Command failed: ${message}`, { error });
      const exitCode = process.exitCode;
      return typeof exitCode === "number" ? exitCode : 1;
    }
  }

  return { run };
}

/**
 * Creates a Commander adapter with default filesystem config loader.
 *
 * @param options - Adapter options (without configLoader)
 *
 * @returns Adapter with run method
 */
export function createCommanderAdapterWithDefaults(
  options: Omit<CommanderAdapterOptions, "configLoader"> & { /**
   *
   */
  context: CliContext }
): ReturnType<typeof createCommanderAdapter> {
  const workingDirectory = options.context.getConfig().workingDirectory ?? process.cwd();
  const loader = createFileSystemConfigLoader(workingDirectory);

  return createCommanderAdapter({
    ...options,
    configLoader: loader,
  });
}