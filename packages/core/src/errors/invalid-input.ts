import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Error thrown when request data fails validation.
 *
 * @remarks
 * This error corresponds to HTTP 400 status and is typically thrown when
 * input data does not meet validation requirements, such as schema validation,
 * type checking, or business rule violations.
 *
 * @example
 * ```typescript
 * // Schema validation failure
 * const result = userSchema.safeParse(input);
 * if (!result.success) {
 *   throw new InvalidInputError("Invalid user data", {
 *     details: result.error.format()
 *   });
 * }
 *
 * // Business rule violation
 * if (age < 18) {
 *   throw new InvalidInputError("User must be 18 or older", {
 *     details: { field: "age", provided: age, minimum: 18 }
 *   });
 * }
 * ```
 */
export class InvalidInputError extends BaseError {
  readonly code = "core:invalid_input";

  /**
   * @param message Human-readable error message describing the validation failure
   * @param meta Additional error metadata (validation details, field info, etc.)
   */
  constructor(message = "Invalid Input", meta?: ErrorMeta) {
    super(message, {
      httpStatus: 400,
      ...meta,
    });
  }
}
