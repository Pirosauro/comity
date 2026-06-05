import type { ErrorMeta } from "@comity/primitives/error";

import { BaseError } from "@comity/primitives/error";

/**
 * Stable reason codes for category errors.
 */
export type CategoryErrorReason =
  | "access_denied"
  | "invalid_data"
  | "service_unavailable"
  | "unknown";

/**
 * Low-level violation codes for category errors.
 */
export type CategoryErrorViolation =
  | "missing_required_field"
  | "invalid_identifier"
  | "invalid_media";

/**
 * Metadata shape attached to category errors.
 */
export interface CategoryErrorMeta extends ErrorMeta {
  /** Typed error reason. */
  readonly reason: CategoryErrorReason;

  /** Optional contextual details for diagnostics. */
  readonly details?: Readonly<{
    /** Optional low-level violation code. */
    violation?: CategoryErrorViolation;

    /** Category identifier when available. */
    id?: string;

    /** Query or operation name when available. */
    operation?: string;
  }>;
}

/**
 * Human-friendly messages mapped by reason.
 */
export const REASON_MESSAGES: Record<CategoryErrorReason, string> = {
  access_denied: "Category access denied",
  invalid_data: "Invalid category data",
  service_unavailable: "Category service unavailable",
  unknown: "Unknown category error",
};

/**
 * Default HTTP status mapped by reason.
 */
export const REASON_HTTP_STATUS: Record<CategoryErrorReason, number> = {
  access_denied: 403,
  invalid_data: 422,
  service_unavailable: 503,
  unknown: 500,
};

/**
 * Catalog operation error with typed reasons and metadata.
 */
export class CategoryError extends BaseError {
  /** Namespaced error code. */
  readonly code: `category:${CategoryErrorReason}`;

  /**
   * @param reason - Error reason code.
   * @param meta - Optional diagnostic metadata.
   */
  constructor(reason: CategoryErrorReason, meta?: Omit<CategoryErrorMeta, "reason">) {
    const message = REASON_MESSAGES[reason];

    super(message, {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `category:${reason}`;
  }
}
