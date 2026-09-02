export type { CliRegistrationFacade } from "./contracts/cli.js";
export type { CliCommand, CliCommandArgs, CliCommandContext, CliArgument, CliOption } from "./contracts/command.js";
export type { CliLifecycle, CliCommandRun, CliHookHandler } from "./contracts/hook.js";
export type { CliErrorReason, CliErrorMeta } from "./errors/cli.js";

export { CliError } from "./errors/cli.js";
export { CliExecutionFacade, createCliExecutionFacade } from "./internal/cli-execution-facade.js";
export { CommandRegistry } from "./internal/command-registry.js";