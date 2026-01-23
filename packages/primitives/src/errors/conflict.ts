import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when a request conflicts with the current state of the resource.
 *
 * @remarks
 * This error corresponds to HTTP 409 status and is typically thrown when
 * attempting to create resources that already exist, or when concurrent
 * modifications create conflicts.
 *
 * @example
 * ```typescript
 * // User already exists
 * if (await db.userExists(email)) {
 *   throw new ConflictError("User with this email already exists", {
 *     details: { email }
 *   });
 * }
 *
 * // Concurrent modification
 * throw new ConflictError("Resource was modified by another request", {
 *   details: { resourceId, lastModified: new Date() }
 * });
 * ```
 */
export class ConflictError extends BaseError {
  readonly code = "core:conflict";

  /**
   * Creates a new ConflictError.
   *
   * @param message Human-readable error message describing the conflict
   * @param meta Additional error metadata (details, context, etc.)
   */
  constructor(message = "Operation conflicts with current state", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 409,
      ...meta,
    });
  }
}
