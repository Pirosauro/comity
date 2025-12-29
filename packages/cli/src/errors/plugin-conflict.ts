import { BaseError } from "@comity/core/errors";

/**
 * Error thrown when attempting to register a CLI plugin that already exists.
 *
 * @remarks
 * This error occurs when multiple plugins with the same name are registered.
 * Plugin names must be unique within a CLI application to prevent conflicts.
 *
 * @example
 * ```typescript
 * try {
 *   cli.registerPlugin({ name: "my-plugin", ... });
 *   cli.registerPlugin({ name: "my-plugin", ... }); // This will throw
 * } catch (error) {
 *   if (error instanceof CliPluginConflictError) {
 *     console.error(`Plugin "${error.meta.plugin}" already exists`);
 *   }
 * }
 * ```
 */
export class CliPluginConflictError extends BaseError {
  readonly code = "CLI_PLUGIN_CONFLICT";

  /**
   * Creates a new CliPluginConflictError.
   *
   * @param meta - Error metadata containing the conflicting plugin name and optional cause
   */
  constructor(meta: { plugin: string; cause?: unknown }) {
    super("CLI plugin already registered", {
      httpStatus: 409,
      plugin: meta.plugin,
      cause: meta.cause,
    });
  }
}
