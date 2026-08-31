import type { CliCommand, CliCommandArgs, CliOption } from "@comity/cli";
import type { CliError } from "@comity/cli/errors";

/**
 * Translates a Core option name into the Commander option attribute key.
 *
 * @param name - Core option name (e.g. `"dry-run"`)
 *
 * @returns Commander attribute key (e.g. `"dryRun"`)
 *
 * @remarks
 * Commander derives parsed option keys from the long flag using camelCase.
 * The adapter maps back through the declared Core name so the neutral
 * `CliCommandArgs` never exposes Commander conventions.
 */
export function toCommanderKey(name: string): string {
  return name
    .split("-")
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

/**
 * Builds the Commander flags string for a Core option declaration.
 *
 * @param option - Core option declaration
 *
 * @returns The flags string (e.g. `"-d, --dry-run <value>"`)
 */
export function toCommanderFlags(option: CliOption): string {
  const flags: string[] = [];

  for (const alias of option.aliases ?? []) {
    flags.push(toCommanderFlag(alias));
  }

  flags.push(toCommanderFlag(option.name));

  const value = option.value ? " <value>" : "";

  return `${flags.join(", ")}${value}`;
}

/**
 * Converts a bare name into a Commander flag token.
 *
 * @param name - Single-character or dashed name (e.g. `"d"` or `"dry-run"`)
 *
 * @returns The flag token (e.g. `"-d"` or `"--dry-run"`)
 */
function toCommanderFlag(name: string): string {
  return name.length === 1 ? `-${name}` : `--${name}`;
}

/**
 * Maps Commander action arguments into neutral Core command arguments.
 *
 * @param command - The Core command being executed
 * @param actionArgs - Arguments received by the Commander action handler
 *
 * @returns Neutral parsed arguments
 *
 * @remarks
 * Commander passes declared positional arguments first, then the parsed
 * options object, then the command instance. Declared arguments are exposed
 * under their declared names; option values are exposed under the declared
 * Core option name.
 */
export function mapActionArgs(
  command: Pick<CliCommand, "arguments" | "options">,
  actionArgs: readonly unknown[]
): CliCommandArgs {
  const declaredArgs = command.arguments ?? [];
  const options = command.options ?? [];
  const opts = (actionArgs[declaredArgs.length] ?? {}) as Record<string, unknown>;
  const values: CliCommandArgs = {};

  for (let i = 0; i < declaredArgs.length; i++) {
    const argument = declaredArgs[i]!;

    values[argument.name] = actionArgs[i];
  }

  for (const option of options) {
    const value = opts[toCommanderKey(option.name)];

    if (value !== undefined) {
      values[option.name] = value;
    }
  }

  return values;
}

/**
 * Formats a Core CLI error into a user-facing message.
 *
 * @param error - The Core CLI error
 *
 * @returns The message to present through Commander error output
 *
 * @remarks
 * When the error carries an underlying cause (a failed command action or
 * hook), the cause message is the useful diagnostic and is preferred.
 */
export function formatCommandError(error: CliError): string {
  const cause = error.cause instanceof Error ? error.cause.message : undefined;

  return cause ?? error.message;
}