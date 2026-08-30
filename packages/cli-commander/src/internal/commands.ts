import type { Cli, CliCommand } from "@comity/cli";
import type { Command } from "commander";

import { formatCommandError, mapActionArgs, toCommanderFlags } from "./mapping.js";

/**
 * Translates a Core command into a Commander subcommand.
 *
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through `createCli`.
 *
 * @param command - Core command definition
 * @param program - Application-owned Commander program
 * @param cli - Core CLI facade used to execute the command
 *
 * @returns The configured Commander subcommand
 *
 * @remarks
 * Pure translation: Core declarations become Commander declarations, and the
 * action delegates execution back to the Core `Cli` facade. Commander
 * failures are routed through the program's error output; the adapter holds
 * no command registration or business logic.
 */
export function toCommanderCommand<Context>(
  command: CliCommand<Context>,
  program: Command,
  cli: Cli<Context>
): Command {
  const cmd = program.command(command.name);

  if (command.description) {
    cmd.description(command.description);
  }

  for (const argument of command.arguments ?? []) {
    const syntax = argument.required ? `<${argument.name}>` : `[${argument.name}]`;

    cmd.argument(syntax, argument.description);
  }

  for (const option of command.options ?? []) {
    const flags = toCommanderFlags(option);

    if (option.required) {
      cmd.requiredOption(flags, option.description);
    } else if (option.default !== undefined) {
      // Commander typings restrict the default parameter to
      // string | boolean | string[]; at runtime arbitrary values are
      // preserved and exposed through opts().
      cmd.option(
        flags,
        option.description,
        option.default as unknown as string | boolean | string[]
      );
    } else {
      cmd.option(flags, option.description);
    }
  }

  cmd.action(async (...actionArgs: unknown[]) => {
    const args = mapActionArgs(command, actionArgs);
    const result = await cli.execute(command.name, args);

    if (!result.success) {
      program.error(formatCommandError(result.error), { exitCode: 1 });
    }
  });

  return cmd;
}
