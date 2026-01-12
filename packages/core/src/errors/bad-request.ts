import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when the request is malformed or contains invalid parameters
 *
 * @remarks
 * This error corresponds to HTTP 400 status and is typically thrown when
 * request validation fails, required parameters are missing, or the request
 * format is incorrect.
 *
 * @example
 * ```typescript
 * // Missing required parameter
 * if (!userId) {
 *   throw new BadRequestError("userId parameter is required", {
 *     details: { missing: ["userId"] }
 *   });
 * }
 *
 * // Invalid format
 * if (!isValidEmail(email)) {
 *   throw new BadRequestError("Invalid email format", {
 *     details: { field: "email", value: email }
 *   });
 * }
 * ```
 */
export class BadRequestError extends BaseError {
  readonly code = "BAD_REQUEST";

  /**
   * @param message Human-readable error message describing the bad request
   * @param meta Additional error metadata (validation details, context, etc.)
   */
  constructor(message: string, meta?: ErrorMeta) {
    super(message, {
      httpStatus: 400,
      ...meta,
    });
  }
}
