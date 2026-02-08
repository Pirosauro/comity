import type { SqlOperationSuccess } from "../contracts/result";

/**
 * Success operation envelope.
 *
 * @param value - Value instance.
 *
 * @returns Success result envelope.
 */
export function success<T>(value: T): SqlOperationSuccess<T> {
  return { success: true, value };
}
