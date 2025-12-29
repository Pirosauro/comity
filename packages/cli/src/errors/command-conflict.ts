import { BaseError } from "@comity/core/errors";

/**
 * Error thrown when attempting to register a CLI command that already exists.
 *
 * @remarks
 * This error occurs when multiple plugins or commands try to register
 * the same command name. Command names must be unique within a CLI application.
 *
 * @example
 * ```typescript
 * try {
 *   cli.registerCommand({ name: "build", ... });
 *   cli.registerCommand({ name: "build", ... }); // This will throw
 * } catch (error) {
 *   if (error instanceof CliCommandConflictError) {
 *     console.error(`Command "${error.meta.command}" already exists`);
 *   }
 * }
 * ```
 */
export class CliCommandConflictError extends BaseError {
  readonly code = "CLI_COMMAND_CONFLICT";

  /**
   * Creates a new CliCommandConflictError.
   *
   * @param meta - Error metadata containing the conflicting command name and optional cause
   */
  constructor(meta: { command: string; cause?: unknown }) {
    super("CLI command already registered", {
      httpStatus: 409,
      command: meta.command,
      cause: meta.cause,
    });
  }
}
