import type { HookHandler } from "@comity/primitives/lifecycle";
import type { CliCommandArgs, CliCommandContext } from "./command.js";

/**
 * Command invocation carried through lifecycle hooks.
 * 
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through the CLI kernel.
 * 
 * @remarks
 * Describes a single command run: the command name, the parsed arguments,
 * and the injected execution context. A `beforeCommand` hook may return a
 * modified invocation; the resulting value is what the command action
 * receives.
 */
export interface CliCommandRun<Context = {}> {
  readonly name: string;
  readonly args: CliCommandArgs;
  readonly context: CliCommandContext<Context>;
}

/**
 * CLI lifecycle hook points.
 * 
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through the CLI kernel.
 * 
 * @remarks
 * The Core defines only the lifecycle points around command execution. It
 * does not define what hooks do; hooks are registered by the Application.
 * Ordering is registration order; executions are sequential.
 */
export type CliLifecycle<Context = {}> = {
  readonly beforeCommand: CliCommandRun<Context>;
  readonly afterCommand: CliCommandRun<Context>;
}

/**
 * CLI lifecycle hook handler.
 * 
 * @typeParam Context - Application-defined context shape supplied at
 *   composition time through the CLI kernel.
 * 
 * @remarks
 * Reuses the primitives hook contract: a handler receives the current value
 * and the initial value, and returns the (possibly transformed) value. The
 * `beforeCommand` handler may transform the invocation before the action
 * runs; `afterCommand` handlers typically return the value unchanged.
 */
export type CliHookHandler<Context = {}> = HookHandler<CliCommandRun<Context>>;