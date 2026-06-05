import type { ErrorMeta } from "@comity/primitives/error";

import { BaseError } from "@comity/primitives/error";

/**
 * Stable reason codes for product errors.
 */
export type ProductErrorReason =
  | "access_denied"
  | "invalid_data"
  | "service_unavailable"
  | "unknown";

/**
 * Low-level violation codes for product errors.
 */
export type ProductErrorViolation =
  | "missing_required_field"
  | "invalid_identifier"
  | "invalid_price"
  | "invalid_inventory"
  | "invalid_media";

/**
 * Metadata shape attached to product errors.
 */
export interface ProductErrorMeta extends ErrorMeta {
  /** Typed error reason. */
  readonly reason: ProductErrorReason;

  /** Optional contextual details for diagnostics. */
  readonly details?: Readonly<{
    /** Optional low-level violation code. */
    violation?: ProductErrorViolation;

    /** Product identifier when available. */
    id?: string;

    /** Product slug when available. */
    slug?: string;

    /** Product SKU when available. */
    sku?: string;

    /** Query or operation name when available. */
    operation?: string;
  }>;
}

/**
 * Human-friendly messages mapped by reason.
 */
export const REASON_MESSAGES: Record<ProductErrorReason, string> = {
  access_denied: "Product access denied",
  invalid_data: "Invalid product data",
  service_unavailable: "Product service unavailable",
  unknown: "Unknown product error",
};

/**
 * Default HTTP status mapped by reason.
 */
export const REASON_HTTP_STATUS: Record<ProductErrorReason, number> = {
  access_denied: 403,
  invalid_data: 422,
  service_unavailable: 503,
  unknown: 500,
};

/**
 * Product operation error with typed reasons and metadata.
 */
export class ProductError extends BaseError {
  /** Namespaced error code. */
  readonly code: `product:${ProductErrorReason}`;

  /**
   * @param reason - Error reason code.
   * @param meta - Optional diagnostic metadata.
   */
  constructor(reason: ProductErrorReason, meta?: Omit<ProductErrorMeta, "reason">) {
    const message = REASON_MESSAGES[reason];

    super(message, {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `product:${reason}`;
  }
}
