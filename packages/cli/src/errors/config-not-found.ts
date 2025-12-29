import { BaseError } from "@comity/core/errors";

/**
 * Error thrown when no CLI configuration file can be found in the expected locations.
 *
 * @remarks
 * This error occurs when the CLI cannot locate a configuration file in any of the
 * standard search paths. The CLI searches for files like `comity.config.ts`,
 * `comity.config.js`, etc. in various directories.
 *
 * @example
 * ```typescript
 * try {
 *   const config = await loadCliConfig();
 * } catch (error) {
 *   if (error instanceof CliConfigNotFoundError) {
 *     console.error("No config file found. Searched in:");
 *     error.meta.searchedPaths.forEach(path => console.error(`  - ${path}`));
 *   }
 * }
 * ```
 */
export class CliConfigNotFoundError extends BaseError {
  readonly code = "CLI_CONFIG_NOT_FOUND";

  /**
   * Creates a new CliConfigNotFoundError.
   *
   * @param meta - Error metadata containing the list of searched paths and optional cause
   */
  constructor(meta: { searchedPaths: string[]; cause?: unknown }) {
    super("CLI configuration file not found", {
      httpStatus: 400,
      searchedPaths: meta.searchedPaths,
      cause: meta.cause,
    });
  }
}
