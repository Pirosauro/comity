import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when the request is understood but access is denied.
 *
 * @remarks
 * This error corresponds to HTTP 403 status and is typically thrown when
 * authentication succeeds but authorization fails, or when access policies
 * prevent the operation.
 *
 * @example
 * ```typescript
 * // Insufficient permissions
 * if (!user.hasRole("admin")) {
 *   throw new ForbiddenError("Admin role required", {
 *     details: { requiredRole: "admin", userRoles: user.roles }
 *   });
 * }
 *
 * // Resource ownership check
 * if (resource.ownerId !== user.id) {
 *   throw new ForbiddenError("You can only modify your own resources");
 * }
 * ```
 */
export class ForbiddenError extends BaseError {
  readonly code = "FORBIDDEN";

  /**
   * Creates a new ForbiddenError.
   *
   * @param message Human-readable error message (defaults to "Access denied")
   * @param meta Additional error metadata (permissions, context, etc.)
   */
  constructor(message = "Access denied", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 403,
      ...meta,
    });
  }
}
