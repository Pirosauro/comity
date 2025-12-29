import type { Logger } from "pino";

/**
 * Configuration for a CLI command option.
 *
 * @remarks
 * Defines the structure for command-line options that can be passed to CLI commands.
 * Options are parsed by the commander.js library and made available to command actions.
 *
 * @example
 * ```typescript
 * const portOption: CliOption = {
 *   flags: "-p, --port <number>",
 *   description: "Port to listen on",
 *   default: 3000
 * };
 * ```
 */
export type CliOption = {
  /** Commander.js flags string (e.g., "-p, --port <number>") */
  flags: string;
  /** Human-readable description of the option */
  description?: string;
  /** Default value if the option is not provided */
  default?: any;
};

/**
 * Definition for a CLI command.
 *
 * @remarks
 * Represents a single command that can be executed by the CLI. Commands are registered
 * with the CLI context and executed when their name is invoked.
 *
 * @example
 * ```typescript
 * const buildCommand: CliCommand = {
 *   name: "build",
 *   description: "Build the application",
 *   options: [
 *     { flags: "-w, --watch", description: "Watch for changes" }
 *   ],
 *   action: async (options) => {
 *     if (options.watch) {
 *       // Start watch mode
 *     } else {
 *       // Build once
 *     }
 *   }
 * };
 * ```
 */
export type CliCommand = {
  /** The command name used to invoke it */
  name: string;
  /** Human-readable description of what the command does */
  description: string;
  /** Function executed when the command is invoked */
  action: (...args: any[]) => void | Promise<void>;
  /** Optional command-line options */
  options?: CliOption[];
};

/**
 * Function signature for CLI hooks.
 *
 * @remarks
 * Hooks are functions that can be executed at specific points during CLI execution.
 * They receive a context object and can perform side effects or modify the context.
 *
 * @param context - Context object passed to the hook function
 *
 * @example
 * ```typescript
 * const loggingHook: CliHook = (context) => {
 *   console.log(`Executing command: ${context.command}`);
 * };
 * ```
 */
export type CliHook = {
  (context: any): void | Promise<void>;
};

/**
 * Definition for a CLI plugin.
 *
 * @remarks
 * Plugins extend the CLI with additional commands and hooks. They are loaded
 * during CLI initialization and can modify the CLI behavior.
 *
 * @example
 * ```typescript
 * const myPlugin: CliPlugin = {
 *   name: "my-plugin",
 *   version: "1.0.0",
 *   commands: [
 *     {
 *       name: "greet",
 *       description: "Print a greeting",
 *       action: () => console.log("Hello!")
 *     }
 *   ],
 *   hooks: {
 *     beforeCommand: (context) => {
 *       console.log(`About to run: ${context.command}`);
 *     }
 *   }
 * };
 * ```
 */
export type CliPlugin = {
  /** Unique name identifying the plugin */
  name: string;
  /** Semantic version of the plugin */
  version: string;
  /** Commands provided by this plugin */
  commands?: CliCommand[];
  /** Hooks provided by this plugin */
  hooks?: {
    [hookName: string]: CliHook;
  };
};

/**
 * Main configuration interface for the Comity CLI.
 *
 * @remarks
 * This interface defines the complete configuration structure for a Comity CLI application.
 * It includes logging configuration, plugins, and global hooks.
 *
 * @example
 * ```typescript
 * const config: CliConfig = {
 *   logger: pino({ level: 'info' }),
 *   plugins: [myPlugin],
 *   hooks: {
 *     beforeCommand: (context) => {
 *       console.log(`Running: ${context.command}`);
 *     }
 *   }
 * };
 * ```
 */
export interface CliConfig {
  /** Pino logger instance for CLI logging */
  logger?: Logger;
  /** Array of plugins to load */
  plugins?: CliPlugin[];
  /** Global hooks available to all commands */
  hooks?: {
    [hookName: string]: CliHook;
  };
}

/**
 * Interface for CLI context operations.
 *
 * @remarks
 * This interface defines the methods available on the CLI context for managing
 * commands, hooks, and plugin registration.
 */
export interface CliContextInterface {
  /** Register a new command */
  registerCommand: (command: CliCommand) => void;
  /** Register a hook for a specific hook name */
  registerHook: (name: string, hook: CliHook) => void;
  /** Execute all hooks for a given hook name */
  executeHook: (name: string, context?: any) => Promise<void>;
}
