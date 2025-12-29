import { BaseError } from "@comity/core/errors";

/**
 * Error thrown when an application root path is invalid or outside the project directory.
 *
 * @remarks
 * This error occurs when a configuration specifies a root path that is not within
 * the current working directory, which is a security measure to prevent accessing
 * files outside the project.
 *
 * @example
 * ```typescript
 * try {
 *   await configureApplication({ rootPath: '../outside' });
 * } catch (error) {
 *   if (error instanceof ApplicationInvalidRootPathError) {
 *     console.error(`Invalid root path: ${error.meta.path}`);
 *   }
 * }
 * ```
 */
export class ApplicationInvalidRootPathError extends BaseError {
  readonly code = "APPLICATION_INVALID_ROOT_PATH";

  /**
   * Creates a new ApplicationInvalidRootPathError.
   *
   * @param meta - Error metadata containing the invalid path, current working directory, and optional cause
   */
  constructor(meta: { path: string; cwd: string; cause?: unknown }) {
    super("Invalid application root path", {
      httpStatus: 400,
      path: meta.path,
      cwd: meta.cwd,
      cause: meta.cause,
    });
  }
}
