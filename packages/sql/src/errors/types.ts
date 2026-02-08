import type { ErrorMeta } from "@comity/primitives/errors";

/**
 * Canonical SQL error reason codes.
 *
 * @remarks
 * Stable, finite set to prevent ambiguous classification.
 */
export type SqlErrorReason =
  | "connection-failed"
  | "invalid-query"
  | "query-failed"
  | "transaction-failed"
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
  /**  */
  readonly operation?: "connect" | "query" | "transaction";

  /** */
  readonly adapter?: string;

  /**  */
  readonly retriable?: boolean;

  /** Canonical failure reason. */
  readonly reason: SqlErrorReason;

  /** Optional adapter-specific error code. */
  readonly detail?: string | number;
}
