import { BaseError } from "@comity/core/errors";

/**
 * Error thrown when a CLI configuration file path is invalid or outside the project root.
 *
 * @remarks
 * This error occurs when a configuration file path specified via environment variables
 * is not within the current working directory, which is a security measure to prevent
 * loading configuration from outside the project.
 *
 * @example
 * ```typescript
 * // This will throw if the path is outside the project root
 * process.env.COMITY_CLI_CONFIG_FILE = "../outside/config.js";
 *
 * try {
 *   await loadCliConfig();
 * } catch (error) {
 *   if (error instanceof CliInvalidConfigPathError) {
 *     console.error(`Invalid config path: ${error.meta.path}`);
 *   }
 * }
 * ```
 */
export class CliInvalidConfigPathError extends BaseError {
  readonly code = "CLI_INVALID_CONFIG_PATH";

  /**
   * Creates a new CliInvalidConfigPathError.
   *
   * @param meta - Error metadata containing the invalid path, current working directory, and optional cause
   */
  constructor(meta: { path: string; cwd: string; cause?: unknown }) {
    super("Invalid CLI configuration file path", {
      httpStatus: 400,
      path: meta.path,
      cwd: meta.cwd,
      cause: meta.cause,
    });
  }
}
