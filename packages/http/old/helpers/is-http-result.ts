import type { BaseError } from "@comity/core/errors";
import type { Result } from "@comity/core/result";

import { isHttpResponse } from "./is-http-response.js";

/**
 * Checks if a value is a Result
 *
 * @param value Value to check
 * @returns True if the value is a Result, false otherwise
 *
 * @typeParam T - Type of the success value
 * @typeParam E - Type of the failure error
 *
 * @remarks
 * This function performs a runtime check to determine if the provided value
 * conforms to the Result type structure, which includes a 'success' boolean property.
 *
 * @example
 * ```typescript
 * const value: unknown = ...;
 * if (isResult<number, Error>(value)) {
 *   if (value.success) {
 *     console.log("Success with value:", value.value);
 *   } else {
 *     console.error("Failure with error:", value.error);
 *   }
 * } else {
 *   console.log("Value is not a Result");
 * }
 * ```
 */
export function isHttpResult<T, E extends BaseError>(
  value: unknown,
): value is Result<T, E> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof value.success === "boolean" &&
    (value.success
      ? "value" in value && isHttpResponse(value.value)
      : "error" in value && value.error instanceof Object)
  );
}
