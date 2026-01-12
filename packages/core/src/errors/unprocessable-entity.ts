import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when the server understands the request but cannot process it.
 *
 * @remarks
 * This error corresponds to HTTP 422 status and is typically thrown when
 * the request is well-formed but contains semantic errors that prevent
 * successful processing, such as invalid data formats or business logic violations.
 *
 * @example
 * ```typescript
 * // Invalid data format
 * if (!isValidDate(dateString)) {
 *   throw new UnprocessableEntityError("Invalid date format", {
 *     details: { field: "date", value: dateString }
 *   });
 * }
 */
export class UnprocessableEntityError extends BaseError {
  readonly code = "UNPROCESSABLE_ENTITY";

  /**
   * @param message Human-readable error message (defaults to "Unprocessable Entity")
   * @param meta Additional error metadata (invalid fields, validation errors, etc.)
   */
  constructor(message = "Unprocessable Entity", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 422,
      ...meta,
    });
  }
}
