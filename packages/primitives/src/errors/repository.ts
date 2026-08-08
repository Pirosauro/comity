import type { ErrorMeta } from "./types.js";

import { BaseError } from "./base.js";

/**
 * Stable repository error reasons.
 */
export type RepositoryErrorReason =
  "invalid_data" | "access_denied" | "service_unavailable" | "protocol_error" | "unknown";

/**
 * Metadata attached to repository errors.
 */
export interface RepositoryErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: RepositoryErrorReason;

  /** Optional diagnostic details. */
  readonly details: Readonly<{
    /** Repository name. */
    repository: string;

    /** Optional operation name. */
    operation: string;
  }>;
}

/**
 * Human-friendly messages mapped by reason.
 */
export const REPOSITORY_ERROR_MESSAGES: Record<RepositoryErrorReason, string> = {
  invalid_data: "Invalid data",
  access_denied: "Access denied",
  service_unavailable: "Service unavailable",
  protocol_error: "Protocol error",
  unknown: "Unknown error",
};

/**
 * Default HTTP status mapped by reason.
 */
export const REPOSITORY_ERROR_HTTP_STATUS: Record<RepositoryErrorReason, number> = {
  invalid_data: 422,
  access_denied: 403,
  service_unavailable: 503,
  protocol_error: 502,
  unknown: 500,
};

/**
 * Generic repository error.
 */
export class RepositoryError extends BaseError {
  /** Namespaced error code. */
  readonly code: `repository:${RepositoryErrorReason}`;

  /**
   * @param reason - Error reason.
   * @param meta - Additional metadata.
   */
  constructor(reason: RepositoryErrorReason, meta?: Omit<RepositoryErrorMeta, "reason">) {
    super(REPOSITORY_ERROR_MESSAGES[reason], {
      httpStatus: REPOSITORY_ERROR_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `repository:${reason}`;
  }
}
