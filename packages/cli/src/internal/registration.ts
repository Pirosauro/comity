import type { CliRegistrationFacade } from "../contracts/cli.js";
import type { CliCommand } from "../contracts/command.js";

import type { CommandRegistry } from "./command-registry.js";
import type { CliError } from "../errors/cli.js";

/**
 * CLI registration facade for module setup.
 * 
 * @typeParam Context - Application-defined context shape.
 * 
 * @remarks
 * This facade is provided to modules during the Composition setup phase
 * when the CLI capability is enabled. It allows modules to register
 * CLI commands during the Composition setup phase.
 */
export class CliRegistration<Context = {}> implements CliRegistrationFacade<Context> {
  readonly #registry: CommandRegistry<Context>;

  constructor(registry: CommandRegistry<Context>) {
    this.#registry = registry;
  }

  /**
   * Register a command.
   * 
   * @param command - Command to register
   * 
   * @throws {Error} If a command with the same name is already registered
   */
  registerCommand(command: CliCommand<Context>): void {
    this.#registry.register(command);
  }

  /**
   * Get all registered commands in registration order.
   * 
   * @returns Registered commands
   */
  commands(): readonly CliCommand<Context>[] {
    return this.#registry.all();
  }
}