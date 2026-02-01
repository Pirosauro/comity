import type { SqlErrorReason } from "@comity/sql/errors";

import { KyselySqlError } from "../errors/kysely.js";
import { ERROR_MESSAGES } from "../errors/types.js";

/**
 *
 */
export interface ErrorConfig {
  /**
   *
   */
  reason: SqlErrorReason;
  /**
   *
   */
  retriable: boolean;
  /**
   *
   */
  message?: string; // override opzionale
}

/**
 *
 */
export type ErrorMappings = Record<string, ErrorConfig>;

// Mappature per driver
export const DRIVER_ERROR_MAPPINGS: Record<string, ErrorMappings> = {
  pg: {
    "57014": { reason: "cancelled", retriable: true },
    "42601": { reason: "invalid-query", retriable: false },
    "08006": { reason: "connection-failed", retriable: true },
    "42883": { reason: "invalid-query", retriable: false },
  },

  mysql: {
    "1317": { reason: "cancelled", retriable: true },
    "1064": { reason: "invalid-query", retriable: false },
  },
} as const;

/**
 * Maps various error types and messages into a standardized KyselySqlError.
 *
 * @param cause - The original error thrown during a SQL operation
 * @param operation - The type of SQL operation being performed
 * @param adapter - Optional database adapter name
 *
 * @returns A standardized KyselySqlError instance
 */
export function mapSqlError(
  cause: unknown,
  operation: "connect" | "query" | "transaction",
  adapter: string
): KyselySqlError {
  // 1. Abort / cancellation
  if (cause instanceof DOMException && cause.name === "AbortError") {
    return new KyselySqlError(ERROR_MESSAGES["cancelled"], {
      reason: "cancelled",
      retriable: true,
      adapter,
      operation,
      cause,
    });
  }

  // 2. Driver-specific (Postgres example)
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

    if (mapping && mapping.reason) {
      return new KyselySqlError(ERROR_MESSAGES[mapping.reason as keyof typeof ERROR_MESSAGES], {
        reason: mapping.reason,
        retriable: mapping.retriable,
        adapter,
        operation,
        detail: cause.code,
        cause,
      });
    }
  }

  // 3. Operation-aware fallback
  if (operation === "transaction") {
    return new KyselySqlError(ERROR_MESSAGES["transaction-failed"], {
      reason: "transaction-failed",
      retriable: false,
      adapter,
      operation,
      cause,
    });
  }

  // 4. Last-resort fallback
  return new KyselySqlError(ERROR_MESSAGES["query-failed"], {
    reason: "query-failed",
    retriable: false,
    adapter,
    operation,
    cause,
  });
}
