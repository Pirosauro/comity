import type { CliCommand } from "../contracts/command.js";

import { CliError } from "../errors/cli.js";

/**
 * Name-keyed command registry.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through `createCli`.
 *
 * @remarks
 * Maintains the set of registered commands and guarantees that command names
 * are unique. Duplicate registration is a composition invariant violation
 * and is reported as a `CliError`.
 */
export class CommandRegistry<Context = {}> {
  /** Registered commands keyed by name */
  readonly #commands = new Map<string, CliCommand<Context>>();

  /**
   * Register a command.
   *
   * @param command - Command to register
   *
   * @throws {CliError} If a command with the same name is already registered
   */
  register(command: CliCommand<Context>): void {
    if (this.#commands.has(command.name)) {
      throw new CliError("duplicate_command", { details: { name: command.name } });
    }

    this.#commands.set(command.name, command);
  }

  /**
   * Get a command by name.
   *
   * @param name - Command name
   *
   * @returns The registered command, or `undefined` if not found
   */
  get(name: string): CliCommand<Context> | undefined {
    return this.#commands.get(name);
  }

  /**
   * Get all registered commands in registration order.
   *
   * @returns Registered commands
   */
  all(): readonly CliCommand<Context>[] {
    return Array.from(this.#commands.values());
  }
}
