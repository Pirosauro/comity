import type { BaseError } from "../errors/base.js";
import type { Result, ResultFailure } from "./types.js";

/**
 * Failure result factory
 *
 * @typeParam Error - Type of the failure error (extends BaseError)
 *
 * @param error Error instance
 *
 * @returns Failure result
 *
 * @example
 * ```typescript
 * const error = new NotFoundError("Item not found");
 * const result: Result<number, NotFoundError> = failure(error);
 * ```
 */
export function failure<E extends BaseError = BaseError>(error: E): ResultFailure<E> {
  return { success: false, error };
}

/**
 * Type guard for failure results.
 *
 * @typeParam Error - Type of the failure error (extends BaseError).
 *
 * @param result - Result to check.
 *
 * @returns True if the result is a failure, false otherwise.
 *
 * @example
 * ```typescript
 * const result: Result<number, NotFoundError> = ...;
 * if (isFailure(result)) {
 *   console.error("Operation failed:", result.error);
 * }
 * ```
 */
export const isFailure = <E extends BaseError = BaseError>(
  result: Result<unknown, E>
): result is ResultFailure<E> => !result.success;
