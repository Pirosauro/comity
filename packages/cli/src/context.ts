import type {
  CliConfig,
  CliCommand,
  CliHook,
  CliContextInterface,
  HookContext,
  Logger,
} from "./types.js";

/**
 * Canonical implementation of the CLI context.
 *
 * @remarks
 * Manages command and hook registration, plugin composition,
 * and hook execution with error isolation.
 */
export class CliContext implements CliContextInterface {
  private readonly commands = new Map<string, CliCommand>();
  private readonly hooks = new Map<string, CliHook[]>();
  private readonly plugins = new Set<string>();

  /**
   * @param config - Resolved CLI configuration
   */
  constructor(private readonly config: CliConfig) {
    // Register plugins first (they may contribute commands/hooks)
    config.plugins?.forEach((plugin) => this.registerPlugin(plugin));

    // Register global hooks from config
    Object.entries(config.hooks || {}).forEach(([name, hook]) => {
      this.registerHook(name, hook);
    });
  }

  /**
   * Get the CLI configuration.
   */
  getConfig(): CliConfig {
    return this.config;
  }

  /**
   * Register a plugin and its commands/hooks.
   *
   * @param plugin - Plugin to register
   * @param plugin.name - Plugin name
   * @param plugin.version - Plugin version
   * @param plugin.commands - Commands contributed by plugin
   * @param plugin.hooks - Hooks contributed by plugin
   *
   * @throws {Error} If plugin name is already registered
   */
  registerPlugin(plugin: {
    name: string;
    version: string;
    commands?: CliCommand[];
    hooks?: Record<string, CliHook>;
  }): void {
    if (this.plugins.has(plugin.name)) {
      const message = `Plugin '${plugin.name}' is already registered.`;

      this.config.logger?.error(message);

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
   * Register a command.
   *
   * @param command - Command to register
   *
   * @throws {Error} If command name is already registered
   */
  registerCommand(command: CliCommand): void {
    if (this.commands.has(command.name)) {
      const message = `Command '${command.name}' is already registered.`;

      this.config.logger?.error(message);

      throw new Error(message);
    }

    this.commands.set(command.name, command);
    this.config.logger?.debug(`Registered command: ${command.name}`);
  }

  /**
   * Register a hook for a given hook name.
   * Multiple hooks per name are executed in registration order.
   *
   * @param name - Hook name
   * @param hook - Hook handler
   */
  registerHook(name: string, hook: CliHook): void {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, []);
    }

    this.hooks.get(name)!.push(hook);
    this.config.logger?.debug(`Registered hook for: ${name}`);
  }

  /**
   * Execute all hooks for a given hook name.
   * Errors in individual hooks are logged but do not stop execution.
   *
   * @param name - Hook name
   * @param context - Hook context
   *
   * @returns Promise that resolves when all hooks complete
   */
  async executeHook(name: string, context: HookContext): Promise<void> {
    const hooks = this.hooks.get(name) || [];

    for (const hook of hooks) {
      try {
        await hook(context);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";

        this.config.logger?.error(`Error in hook '${name}': ${message}`, { error });
      }
    }
  }

  /**
   * Get a command by name.
   *
   * @param name - Command name
   *
   * @returns Command if found, undefined otherwise
   */
  getCommand(name: string): CliCommand | undefined {
    return this.commands.get(name);
  }

  /**
   * Get all registered commands in registration order.
   *
   * @returns Array of all registered commands
   */
  getAllCommands(): CliCommand[] {
    return Array.from(this.commands.values());
  }
}