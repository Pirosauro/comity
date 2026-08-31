import type { Result } from "@comity/primitives/result";
import type { BaseError } from "@comity/primitives/errors";

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
export interface CliArgument {
  readonly name: string;
  readonly description?: string;
  readonly required?: boolean;
}

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
export interface CliOption {
  readonly name: string;
  readonly aliases?: readonly string[];
  readonly description?: string;
  readonly required?: boolean;
  readonly value?: boolean;
  readonly default?: string | number | boolean;
}

/**
 * Read-only execution context passed to command actions.
 * 
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through the CLI kernel.
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
 *   composition time through the CLI kernel.
 * 
 * @remarks
 * Defines a command declaratively: name, description, declared arguments and
 * options, and the action invoked at execution time. The action receives the
 * adapter-parsed arguments and the injected execution context. Failures are
 * expressed by returning a `Result` failure; the Core execution contract
 * normalizes thrown errors into `Result` failures.
 */
export interface CliCommand<Context = {}> {
  readonly name: string;
  readonly description?: string;
  readonly arguments?: readonly CliArgument[];
  readonly options?: readonly CliOption[];
  readonly action: (
    args: CliCommandArgs,
    context: CliCommandContext<Context>
  ) => void | Promise<void> | Result<void, BaseError>;
}