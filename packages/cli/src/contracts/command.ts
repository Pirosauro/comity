/**
 * Parsed command arguments.
 *
 * @remarks
 * Opaque record of values parsed by a runtime adapter. Positional arguments
 * are exposed under their declared argument name; options are exposed under
 * their declared option name. The Core never interprets or parses these
 * values; it only carries them between adapter and command action.
 */
export type CliCommandArgs = Record<string, unknown>;

/**
 * Positional argument declaration.
 *
 * @remarks
 * Represents a single positional argument of a command in a
 * technology-neutral way. `required` defaults to `false`.
 */
export type CliArgument = Readonly<{
  /** Argument name, used as the key in {@link CliCommandArgs} */
  name: string;

  /** Human-readable description */
  description?: string;

  /** Whether the argument is required (default: `false`) */
  required?: boolean;
}>;

/**
 * Command-line option declaration.
 *
 * @remarks
 * Describes an option/flag without any framework-specific syntax. The option
 * `name` is the long flag name without dashes (e.g. `"dry-run"`); single
 * character short aliases (e.g. `["d"]`) may be declared separately. The
 * adapter is responsible for translating this declaration into the runtime
 * representation.
 */
export type CliOption = Readonly<{
  /** Long flag name without dashes (e.g. `"dry-run"`) */
  name: string;

  /** Single-character short aliases (e.g. `["d"]`) */
  aliases?: readonly string[];

  /** Human-readable description */
  description?: string;

  /** Whether the option is required (default: `false`) */
  required?: boolean;

  /** Whether the option consumes a value (default: `false`) */
  value?: boolean;

  /** Default value applied when the option is not provided */
  default?: string | number | boolean;
}>;

/**
 * Read-only execution context passed to command actions.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through `createCli`.
 *
 * @remarks
 * The Core passes the application-provided execution context through
 * unchanged. The context is the explicit vehicle for application
 * configuration, services, and any other injected capability.
 */
export type CliCommandContext<Context = {}> = Readonly<Context>;

/**
 * CLI command definition.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through {@link Cli.command}.
 *
 * @remarks
 * Defines a command declaratively: name, description, declared arguments and
 * options, and the action invoked at execution time. The action receives the
 * adapter-parsed arguments and the injected execution context. Failures are
 * expressed by throwing; the Core execution contract normalizes thrown
 * errors into `Result` failures.
 */
export type CliCommand<Context = {}> = Readonly<{
  /** Unique command name */
  name: string;

  /** Human-readable description */
  description?: string;

  /** Declared positional arguments */
  arguments?: readonly CliArgument[];

  /** Declared options */
  options?: readonly CliOption[];
  /**
   * Command action handler.
   *
   * @param args - Parsed command arguments
   * @param context - Injected execution context
   */
  action: (args: CliCommandArgs, context: CliCommandContext<Context>) => void | Promise<void>;
}>;
