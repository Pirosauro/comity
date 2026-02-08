import type { SqlOperationFailure } from "../contracts/result.js";
import type { SqlError } from "../errors/error.js";

/**
 * Failure operation envelope.
 *
 * @param error - Error instance.
 *
 * @returns Failure result envelope.
 */
export function failure(error: SqlError): SqlOperationFailure {
  return {
    success: false,
    error,
  };
}
