import type { Result, ResultSuccess } from "./types.js";

/**
 * Success result factory
 *
 * @param value Success value
 * @param meta Optional metadata
 * @returns Success result
 *
 * @typeParam Value - Type of the success value
 *
 * @example
 * ```typescript
 * const result: Result<number> = success(42, { timestamp: Date.now() });
 * ```
 */
export function success<Value>(
  value: Value,
  meta?: Record<string, unknown>,
): ResultSuccess<Value> {
  return { success: true, value, ...(meta && { meta }) };
}

/**
 * Type guard for success results
 *
 * @param result Result to check
 * @returns True if the result is a success, false otherwise
 *
 * @typeParam Value - Type of the success value
 *
 * @example
 * ```typescript
 * const result: Result<number> = ...;
 * if (isSuccess(result)) {
 *   console.log("Operation succeeded:", result.value);
 * }
 * ```
 */
export const isSuccess = <Value>(
  result: Result<Value>,
): result is ResultSuccess<Value> => result.success;
