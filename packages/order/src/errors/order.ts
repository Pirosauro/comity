import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Order error reason.
 */
export type OrderErrorReason =
  | "not_found"
  | "validation_failed"
  | "access_denied"
  | "repository_error"
  | "invalid_status_transition"
  | "unknown";

/**
 * Order violation.
 */
type OrderViolation =
  | "insufficient_stock"
  | "invalid_quantity"
  | "product_not_available"
  | "coupon_invalid"
  | "coupon_expired";

/**
 * Order error metadata.
 */
interface OrderErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: OrderErrorReason;

  /** Domain violation. */
  readonly violation?: OrderViolation;

  /** Contextual details. */
  readonly details?: Readonly<{
    /** Affected order ID. */
    orderId?: string;

    /** Affected item ID. */
    itemId?: string;

    /** Affected SKU. */
    sku?: string;
  }>;
}

const REASON_MESSAGES: Record<OrderErrorReason, string> = {
  not_found: "Order not found",
  validation_failed: "Order validation failed",
  access_denied: "Access to order denied",
  repository_error: "Order repository error",
  invalid_status_transition: "Invalid order status transition",
  unknown: "Unknown error",
};

const REASON_HTTP_STATUS: Record<OrderErrorReason, number> = {
  not_found: 404,
  validation_failed: 400,
  access_denied: 403,
  repository_error: 500,
  invalid_status_transition: 409,
  unknown: 500,
};

/**
 * Order operation error with typed reasons.
 */
export class OrderError extends BaseError<OrderErrorMeta> {
  /** Error code. */
  readonly code: `order:${OrderErrorReason}`;

  /**
   * @param reason - The reason for the order error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: OrderErrorReason, meta?: Omit<OrderErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `order:${reason}`;
  }
}