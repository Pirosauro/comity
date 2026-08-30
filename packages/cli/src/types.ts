import type { ReadonlyDeep } from "@comity/primitives";

/**
 * CLI option definition.
 *
 * @remarks
 * Represents a command-line option (flag) with its metadata.
 * The `flags` string follows Commander.js convention (e.g., "-f, --force").
 */
export type CliOption = {
  /** Flag definition following Commander convention (e.g., "-f, --force") */
  flags: string;
  /** Human-readable description of the option */
  description?: string;
  /** Default value when option is not provided */
  default?: unknown;
};

/**
 * CLI command definition.
 *
 * @remarks
 * Defines a single CLI command with its action and options.
 * Arguments are kept opaque to the Core; the adapter handles parsing.
 */
export type CliCommand = {
  /** Unique command name (e.g., "build") */
  name: string;
  /** Human-readable description */
  description?: string;
  /**
   * Command action handler.
   * Receives parsed arguments and execution context.
   * Failures should throw; the adapter maps exceptions to exit codes.
   */
  action: (args: CliCommandArgs, context: CliCommandContext) => void | Promise<void>;
  /** Command-specific options */
  options?: CliOption[];
};

/**
 * Parsed command arguments.
 *
 * @remarks
 * Opaque record of parsed values (options + positional arguments).
 * The Core does not distinguish between option types; the adapter
 * is responsible for parsing and validation.
 */
export type CliCommandArgs = Record<string, unknown>;

/**
 * Context provided to command actions.
 */
export type CliCommandContext = {
  /** Resolved configuration */
  config: CliConfig;
  /** Injected logger */
  logger: Logger;
};

/**
 * Hook handler function.
 *
 * @remarks
 * Hooks are lifecycle extension points. They receive context
 * and may perform side effects. Errors in hooks are logged
 * but do not stop execution of subsequent hooks.
 */
export type CliHook = (context: HookContext) => void | Promise<void>;

/**
 * Context passed to hook handlers.
 */
export type HookContext = {
  /** Name of the command being executed */
  commandName: string;
  /** Parsed command arguments */
  args: CliCommandArgs;
  /** Resolved configuration */
  config: CliConfig;
  /** Injected logger */
  logger: Logger;
};

/**
 * CLI plugin definition.
 *
 * @remarks
 * Plugins bundle commands and hooks under a named, versioned unit.
 * Duplicate plugin registration is rejected.
 */
export type CliPlugin = {
  /** Unique plugin identifier */
  name: string;
  /** Semantic version */
  version: string;
  /** Commands contributed by this plugin */
  commands?: CliCommand[];
  /** Hooks contributed by this plugin */
  hooks?: Record<string, CliHook>;
};

/**
 * CLI configuration.
 *
 * @remarks
 * The configuration object is constructed by the Application or Adapter
 * and passed to the CliContext. The Core does not perform filesystem
 * discovery; it receives a fully resolved configuration object.
 */
export interface CliConfig {
  /** Optional logger instance (if not provided, adapter may supply default) */
  logger?: Logger;
  /** Registered plugins */
  plugins?: CliPlugin[];
  /** Global hooks */
  hooks?: Record<string, CliHook>;
  /** Working directory for config resolution (injected by Application) */
  workingDirectory?: string;
}

/**
 * Minimal logger interface.
 *
 * @remarks
 * The Core does not depend on a concrete logging implementation.
 * The adapter or application injects a logger satisfying this interface.
 */
export interface Logger {
  /** Informational message */
  info(message: string, meta?: Record<string, unknown>): void;
  /** Error message */
  error(message: string, meta?: Record<string, unknown>): void;
  /** Debug message */
  debug(message: string, meta?: Record<string, unknown>): void;
}

/**
 * CliContext public interface.
 *
 * @remarks
 * Defines the contract for command and hook registration.
 * The canonical implementation is provided by {@link CliContext}.
 */
export interface CliContextInterface {
  /** Register a command; throws if name already exists */
  registerCommand(command: CliCommand): void;
  /** Register a hook; multiple hooks per name are supported */
  registerHook(name: string, hook: CliHook): void;
  /** Execute all hooks for a name; errors are isolated */
  executeHook(name: string, context: HookContext): Promise<void>;
  /** Get a command by name */
  getCommand(name: string): CliCommand | undefined;
  /** Get all registered commands */
  getAllCommands(): CliCommand[];
}

/**
 * Configuration loader abstraction.
 *
 * @remarks
 * The Core defines the contract; the Adapter provides the
 * filesystem implementation (TS/JS/JSON config discovery).
 */
export interface CliConfigLoader {
  /** Load and return the resolved configuration */
  load(): Promise<CliConfig>;
}