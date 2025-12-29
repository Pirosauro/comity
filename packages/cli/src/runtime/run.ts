import { Command } from "commander";
import { CliContext } from "./context.js";
import { loadCliConfig } from "./loader.js";
import { VERSION } from "../constant.js";

/**
 * Initializes and runs the CLI application with the given command line arguments.
 *
 * @param argv - Command line arguments array (typically `process.argv`)
 *
 * @remarks
 * This function performs the following steps:
 * 1. Loads the CLI configuration from file
 * 2. Creates a CLI context with the loaded configuration
 * 3. Sets up Commander.js with all registered commands
 * 4. Parses the command line arguments and executes the appropriate command
 *
 * Commands are executed with before/after hooks automatically.
 * The function does not return - it either succeeds or throws an error.
 *
 * @throws {CliConfigNotFoundError} When no configuration file is found
 * @throws {CliInvalidConfigPathError} When config path is invalid
 * @throws {CliCommandConflictError} When duplicate commands are registered
 * @throws {CliPluginConflictError} When duplicate plugins are registered
 * @throws {CliHookExecutionError} When a hook fails during execution
 *
 * @example
 * Basic CLI execution
 * ```typescript
 * try {
 *   await run(process.argv);
 * } catch (error) {
 *   console.error("CLI execution failed:", error.message);
 *   process.exit(1);
 * }
 * ```
 *
 * @example
 * Custom argument parsing
 * ```typescript
 * // Simulate command line arguments
 * const testArgs = ["node", "cli.js", "build", "--watch"];
 * await run(testArgs);
 * ```
 */
export async function run(argv: string[]) {
  // Load configuration
  const config = await loadCliConfig();
  // Initialize core
  const cli = new CliContext(config);
  // Create the commander application
  const program = new Command();

  program.name("Comity CLI").version(VERSION);

  // Register all commands
  cli.getAllCommands().forEach((command) => {
    const cmd = program.command(command.name);

    if (command.description) {
      cmd.description(command.description);
    }

    // Add options
    command.options?.forEach((option) => {
      cmd.option(option.flags, option.description, option.default);
    });

    // Add action
    cmd.action(async (...args) => {
      await cli.executeHook("beforeCommand", { command: command.name, args });
      await command.action(...args);
      await cli.executeHook("afterCommand", { command: command.name, args });
    });
  });

  // Parse arguments
  program.parse(process.argv);
}
