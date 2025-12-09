import type { Logger } from "pino";
import {
  CliConfig,
  CliContextInterface,
  CliPlugin,
  CliCommand,
  CliHook,
} from "./types.js";
import { pino } from "pino";

/**
 * CLI context for managing plugins, commands, and hooks.
 */
export class CliContext implements CliContextInterface {
  private commands: Map<string, CliCommand> = new Map();
  private hooks: Map<string, CliHook[]> = new Map();
  private plugins: Set<string> = new Set();
  private logger: Logger;

  constructor(config: CliConfig) {
    this.logger = config.logger || pino();

    config.plugins?.forEach((plugin) => this.registerPlugin(plugin));

    // Register global hooks
    Object.entries(config.hooks || {}).forEach(([name, hook]) => {
      this.registerHook(name, hook);
    });
  }

  /**
   * Registers a plugin and its commands/hooks.
   * Prevents duplicate plugin registration.
   */
  registerPlugin(plugin: CliPlugin) {
    if (this.plugins.has(plugin.name)) {
      const message = `Plugin '${plugin.name}' is already registered.`;

      this.logger.error(message);

      throw new Error(message);
    }

    this.plugins.add(plugin.name);

    plugin.commands?.forEach((command) => {
      this.registerCommand(command);
    });

    Object.entries(plugin.hooks || {}).forEach(([hookName, hook]) => {
      this.registerHook(hookName, hook);
    });
  }

  /**
   * Registers a command.
   * Throws if a command with the same name already exists.
   */
  registerCommand(command: CliCommand) {
    if (this.commands.has(command.name)) {
      const message = `Command '${command.name}' is already registered.`;

      this.logger.error(message);

      throw new Error(message);
    }

    this.commands.set(command.name, command);
    this.logger.debug(`Registered command: ${command.name}`);
  }

  /**
   * Registers a hook for a given hook name.
   */
  registerHook(hookName: string, hook: CliHook) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }

    this.hooks.get(hookName)!.push(hook);
    this.logger.debug(`Registered hook for: ${hookName}`);
  }

  /**
   * Executes all hooks for a given hook name.
   * Errors in hooks are logged but do not stop execution.
   */
  async executeHook(hookName: string, context: any = {}): Promise<void> {
    const hooks = this.hooks.get(hookName) || [];

    for (const hook of hooks) {
      try {
        await hook(context);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        this.logger.error(error, `Error in hook '${hookName}': ${message}`);
      }
    }
  }

  /**
   * Gets a command by name.
   */
  getCommand(name: string): CliCommand | undefined {
    return this.commands.get(name);
  }

  /**
   * Gets all registered commands.
   */
  getAllCommands(): CliCommand[] {
    return Array.from(this.commands.values());
  }
}
