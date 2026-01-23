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
 *   throw new DomainViolationError("Invalid date format", {
 *     details: { field: "date", value: dateString }
 *   });
 * }
 */
export class DomainViolationError extends BaseError {
  readonly code = "core:domain-violation";

  /**
   * @param message Human-readable error message (defaults to "Domain invariants violated")
   * @param meta Additional error metadata (invalid fields, validation errors, etc.)
   */
  constructor(message = "Domain invariants violated", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 422,
      ...meta,
    });
  }
}
