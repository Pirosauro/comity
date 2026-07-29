import type { SqlErrorReason } from "@comity/sql/errors";

import { SqlError } from "@comity/sql/errors";

/**
 * Internal type for driver-specific error code mappings.
 */
type ErrorDetails = {
  /** Error reason */
  reason: SqlErrorReason;

  /** Indicates if the error is retriable */
  retriable: boolean;
};

/**
 * Driver-specific error code mappings.
 */
export const DRIVER_ERROR_MAPPINGS: Record<string, Record<string, ErrorDetails>> = {
  postgres: {
    "57014": { reason: "cancelled", retriable: true },
    "42601": { reason: "invalid_query", retriable: false },
    "08006": { reason: "connection_failed", retriable: true },
    "42883": { reason: "invalid_query", retriable: false },
  },

  mysql: {
    "1317": { reason: "cancelled", retriable: true },
    "1064": { reason: "invalid_query", retriable: false },
  },
} as const;

/**
 * Maps various error types and messages into a standardized SqlError.
 *
 * @param cause - The original error thrown during a SQL operation
 * @param operation - The type of SQL operation being performed
 * @param adapter - Optional database adapter name
 *
 * @returns A standardized SqlError instance
 */
export function mapSqlError(
  cause: unknown,
  operation: "connect" | "query" | "transaction",
  adapter: string
): SqlError {
  // 1. Abort / cancellation
  if (cause instanceof DOMException && cause.name === "AbortError") {
    return new SqlError("cancelled", {
      details: { operation, adapter, retriable: true },
      cause,
    });
  }

  // 2. Driver-specific error code mappings
  if (
    adapter in DRIVER_ERROR_MAPPINGS &&
    typeof DRIVER_ERROR_MAPPINGS[adapter] === "object" &&
    typeof cause === "object" &&
    cause &&
    "code" in cause &&
    typeof cause.code === "string" &&
    cause.code in DRIVER_ERROR_MAPPINGS[adapter] &&
    DRIVER_ERROR_MAPPINGS[adapter][cause.code]
  ) {
    const mapping = DRIVER_ERROR_MAPPINGS[adapter][cause.code];

    // Return mapped error
    if (mapping && mapping.reason) {
      return new SqlError(mapping.reason, {
        details: { operation, adapter, retriable: mapping.retriable },
        context: { originalCode: cause.code },
        cause,
      });
    }
  }

  // 3. Operation-aware fallback
  if (operation === "transaction") {
    return new SqlError("transaction_failed", {
      details: { operation, adapter, retriable: false },
      cause,
    });
  }

  // 4. Last-resort fallback
  return new SqlError("query_failed", {
    details: { operation, adapter, retriable: false },
    cause,
  });
}
