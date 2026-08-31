import type { CliCommand } from "./command.js";

/**
 * CLI registration facade contract.
 * 
 * @typeParam Context - Application-defined context shape.
 * 
 * @remarks
 * The facade through which commands are registered during module setup.
 * It is provided by the Application to modules that opt into CLI capability.
 * The Application creates the registry and invokes module capabilities.
 * Adapters consume the execution facade for command execution.
 */
export interface CliRegistrationFacade<Context = {}> {
  /**
   * Register a command.
   * 
   * @param command - Command to register
   * 
   * @throws {Error} If a command with the same name is already registered
   */
  registerCommand(command: CliCommand<Context>): void;
  
  /**
   * Get all registered commands in registration order.
   * 
   * @returns Registered commands
   */
  commands(): readonly CliCommand<Context>[];
}