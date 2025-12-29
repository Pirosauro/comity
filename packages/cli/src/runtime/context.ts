import type {
  CliConfig,
  CliContextInterface,
  CliPlugin,
  CliCommand,
  CliHook,
} from "../types.js";
import {
  CliCommandConflictError,
  CliHookExecutionError,
  CliPluginConflictError,
} from "../errors/index.js";

/**
 * CLI context for managing plugins, commands, and hooks.
 *
 * @remarks
 * The CliContext class is the central registry for CLI functionality. It manages
 * the registration of plugins, commands, and hooks, and provides methods to execute
 * hooks and retrieve registered commands.
 *
 * **Key Features:**
 * - Plugin registration with conflict detection
 * - Command registration with uniqueness validation
 * - Hook system for extensibility
 * - Type-safe command and hook management
 *
 * @example
 * ```typescript
 * const config: CliConfig = {
 *   plugins: [myPlugin],
 *   hooks: {
 *     beforeCommand: (ctx) => console.log(`Running: ${ctx.command}`)
 *   }
 * };
 *
 * const cli = new CliContext(config);
 * const buildCommand = cli.getCommand("build");
 * ```
 */
export class CliContext implements CliContextInterface {
  private commands: Map<string, CliCommand> = new Map();
  private hooks: Map<string, CliHook[]> = new Map();
  private plugins: Set<string> = new Set();

  /**
   * Creates a new CLI context with the given configuration.
   *
   * @param config - CLI configuration including plugins and global hooks
   *
   * @remarks
   * During initialization, all plugins from the configuration are registered,
   * and global hooks are set up.
   */
  constructor(config: CliConfig) {
    config.plugins?.forEach((plugin) => this.registerPlugin(plugin));

    // Register global hooks
    Object.entries(config.hooks || {}).forEach(([name, hook]) => {
      this.registerHook(name, hook);
    });
  }

  /**
   * Registers a plugin and its commands/hooks.
   *
   * @param plugin - The plugin to register
   *
   * @remarks
   * Prevents duplicate plugin registration by checking plugin names.
   * All commands and hooks from the plugin are automatically registered.
   *
   * @throws {CliPluginConflictError} When a plugin with the same name already exists
   *
   * @example
   * ```typescript
   * const plugin: CliPlugin = {
   *   name: "build-tools",
   *   version: "1.0.0",
   *   commands: [buildCommand],
   *   hooks: { beforeCommand: logHook }
   * };
   *
   * cli.registerPlugin(plugin);
   * ```
   */
  registerPlugin(plugin: CliPlugin) {
    if (this.plugins.has(plugin.name)) {
      throw new CliPluginConflictError({ plugin: plugin.name });
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
   *
   * @param command - The command to register
   *
   * @remarks
   * Commands must have unique names. If a command with the same name
   * already exists, a conflict error is thrown.
   *
   * @throws {CliCommandConflictError} When a command with the same name already exists
   *
   * @example
   * ```typescript
   * const deployCommand: CliCommand = {
   *   name: "deploy",
   *   description: "Deploy the application",
   *   action: async () => {
   *     // Deployment logic
   *   }
   * };
   *
   * cli.registerCommand(deployCommand);
   * ```
   */
  registerCommand(command: CliCommand) {
    if (this.commands.has(command.name)) {
      throw new CliCommandConflictError({ command: command.name });
    }

    this.commands.set(command.name, command);
  }

  /**
   * Registers a hook for a given hook name.
   *
   * @param hookName - The name of the hook to register
   * @param hook - The hook function to execute
   *
   * @remarks
   * Multiple hooks can be registered for the same hook name.
   * They will be executed in registration order.
   *
   * @example
   * ```typescript
   * cli.registerHook("beforeCommand", (context) => {
   *   console.log(`About to run: ${context.command}`);
   * });
   *
   * cli.registerHook("beforeCommand", (context) => {
   *   // Another hook for the same event
   *   analytics.track("command_started", { command: context.command });
   * });
   * ```
   */
  registerHook(hookName: string, hook: CliHook) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }

    this.hooks.get(hookName)!.push(hook);
  }

  /**
   * Executes all hooks for a given hook name.
   *
   * @param hookName - The name of the hook to execute
   * @param context - Context object passed to hook functions
   *
   * @remarks
   * Hooks are executed sequentially in registration order.
   * If a hook throws an error, execution stops and a CliHookExecutionError is thrown.
   * This prevents hook failures from silently failing.
   *
   * @throws {CliHookExecutionError} When any hook throws an error during execution
   *
   * @example
   * ```typescript
   * try {
   *   await cli.executeHook("beforeCommand", {
   *     command: "build",
   *     args: ["--watch"]
   *   });
   * } catch (error) {
   *   if (error instanceof CliHookExecutionError) {
   *     console.error(`Hook failed: ${error.meta.hook}`);
   *   }
   * }
   * ```
   */
  async executeHook(hookName: string, context: any = {}): Promise<void> {
    const hooks = this.hooks.get(hookName) || [];

    for (const hook of hooks) {
      try {
        await hook(context);
      } catch (cause) {
        throw new CliHookExecutionError({ hook: hookName, cause });
      }
    }
  }

  /**
   * Gets a command by name.
   *
   * @param name - The name of the command to retrieve
   * @returns The command if found, undefined otherwise
   *
   * @example
   * ```typescript
   * const buildCommand = cli.getCommand("build");
   * if (buildCommand) {
   *   console.log(`Found command: ${buildCommand.description}`);
   * }
   * ```
   */
  getCommand(name: string): CliCommand | undefined {
    return this.commands.get(name);
  }

  /**
   * Gets all registered commands.
   *
   * @returns Array of all registered commands
   *
   * @example
   * ```typescript
   * const commands = cli.getAllCommands();
   * console.log(`Available commands: ${commands.map(c => c.name).join(", ")}`);
   * ```
   */
  getAllCommands(): CliCommand[] {
    return Array.from(this.commands.values());
  }
}
