import { BaseError } from "@comity/core/errors";

/**
 * Error thrown when a CLI configuration file cannot be loaded or parsed.
 *
 * @remarks
 * This error occurs when there's a syntax error, import error, or other issue
 * preventing the configuration file from being loaded successfully.
 *
 * @example
 * ```typescript
 * try {
 *   const config = await loadCliConfig();
 * } catch (error) {
 *   if (error instanceof CliConfigLoadError) {
 *     console.error(`Failed to load config from ${error.meta.path}:`, error.meta.cause);
 *   }
 * }
 * ```
 */
export class CliConfigLoadError extends BaseError {
  readonly code = "CLI_CONFIG_LOAD_ERROR";

  /**
   * Creates a new CliConfigLoadError.
   *
   * @param meta - Error metadata containing the config file path and the underlying cause
   */
  constructor(meta: { path: string; cause: unknown }) {
    super("Failed to load CLI configuration file", {
      httpStatus: 400,
      path: meta.path,
      cause: meta.cause,
    });
  }
}
