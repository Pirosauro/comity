import { BaseError } from "@comity/core/errors";

/**
 * Error thrown when a CLI hook fails to execute.
 *
 * @remarks
 * This error occurs when a hook function throws an exception during execution.
 * Hook execution errors are caught and re-thrown as CliHookExecutionError to
 * provide better error context and prevent hook failures from crashing the CLI.
 *
 * @example
 * ```typescript
 * try {
 *   await cli.executeHook("beforeCommand", context);
 * } catch (error) {
 *   if (error instanceof CliHookExecutionError) {
 *     console.error(`Hook "${error.meta.hook}" failed:`, error.meta.cause);
 *   }
 * }
 * ```
 */
export class CliHookExecutionError extends BaseError {
  readonly code = "CLI_HOOK_EXECUTION_ERROR";

  /**
   * Creates a new CliHookExecutionError.
   *
   * @param meta - Error metadata containing the hook name and the underlying cause
   */
  constructor(meta: { hook: string; cause: unknown }) {
    super("CLI hook execution failed", {
      httpStatus: 500,
      hook: meta.hook,
      cause: meta.cause,
    });
  }
}
