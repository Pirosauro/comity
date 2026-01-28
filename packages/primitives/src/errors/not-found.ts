import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when a requested resource cannot be found.
 *
 * @remarks
 * This error corresponds to HTTP 404 status and is typically thrown when
 * database queries, API calls, or file operations fail to locate the requested resource.
 *
 * @example
 * ```typescript
 * // Resource not found in database
 * const user = await db.findUser(id);
 * if (!user) {
 *   throw new NotFoundError("user", { id });
 * }
 *
 * // File not found
 * if (!fs.existsSync(filePath)) {
 *   throw new NotFoundError("file", { path: filePath });
 * }
 * ```
 */
export class NotFoundError extends BaseError {
  readonly code = "core:not-found";

  /**
   * @param message Human-readable error message describing the not found error
   * @param meta Additional error metadata (criteria, context, etc.)
   */
  constructor(message: string = "Resource not found", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 404,
      ...meta,
    });
  }
}
