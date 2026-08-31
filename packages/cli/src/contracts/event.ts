import type { CliCommandArgs, CliCommandContext } from "./command.js";

/**
 * CLI events for observability.
 *
 * @typeParam Context - Application-defined context shape.
 *
 * @remarks
 * Events describe something that already happened. They are fire-and-forget,
 * non-blocking, and side-effect free. If no one listens, nothing breaks.
 * Events are for logging, metrics, tracing, and external integrations.
 */
export interface CliEvents<Context = {}> extends Record<string, unknown> {
  readonly "cli.command.started": {
    readonly name: string;
    readonly args: CliCommandArgs;
    readonly context: CliCommandContext<Context>;
  };
  readonly "cli.command.completed": {
    readonly name: string;
    readonly args: CliCommandArgs;
    readonly context: CliCommandContext<Context>;
    readonly durationMs: number;
  };
  readonly "cli.command.failed": {
    readonly name: string;
    readonly args: CliCommandArgs;
    readonly context: CliCommandContext<Context>;
    readonly error: Error;
    readonly durationMs: number;
  };
}