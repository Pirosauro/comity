import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Canonical SQL error reason codes.
 *
 * @remarks
 * Stable, finite set to prevent ambiguous classification.
 */
export type SqlErrorReason =
  | "connection_failed"
  | "invalid_configuration"
  | "invalid_query"
  | "query_failed"
  | "transaction_failed"
  | "timeout"
  | "cancelled";

/**
 * Optional error metadata for diagnostics.
 *
 * @remarks
 * `reason` is mandatory and must be stable.
 * `detail` is non-canonical. Must NOT be used for application logic or branching.
 * Never include sensitive data.
 */
export interface SqlErrorMeta extends ErrorMeta {
  /** Canonical failure reason. */
  readonly reason: SqlErrorReason;

  /** Additional non-canonical details for diagnostics. */
  readonly details?: Readonly<{
    /**  */
    operation?: "connect" | "query" | "transaction";

    /** */
    adapter?: string;

    /**  */
    retriable?: boolean;

    /**  */
    expected?: string;
  }>;
}

const REASON_MESSAGES: Record<SqlErrorReason, string> = {
  connection_failed: "Failed to connect to the database",
  invalid_configuration: "The SQL client configuration is invalid",
  invalid_query: "The SQL query is invalid",
  query_failed: "The SQL query failed to execute",
  transaction_failed: "The SQL transaction failed",
  timeout: "The SQL operation timed out",
  cancelled: "The SQL operation was cancelled",
};

/**
 * Base class for SQL-related errors.
 *
 * @remarks
 * The error message is non-canonical and intended for diagnostics only.
 * Consumers must rely on `meta.reason` for logic.
 */
export class SqlError extends BaseError<SqlErrorMeta> {
  /** Error code */
  readonly code: `sql:${SqlErrorReason}`;

  /**
   * @param reason - The reason for the SQL error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: SqlErrorReason, meta?: Omit<SqlErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: 500,
      ...meta,
      reason,
    });

    this.code = `sql:${reason}`;
  }
}
