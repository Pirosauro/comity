import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 *
 */
export type CartErrorReason =
  | "not_found"
  | "validation_failed"
  | "access_denied"
  | "repository_error"
  | "unknown";

/**
 *
 */
type CartViolation =
  | "insufficient_stock"
  | "invalid_quantity"
  | "product_not_available"
  | "coupon_invalid"
  | "coupon_expired";

/**
 *
 */
interface CartErrorMeta extends ErrorMeta {
  /**  */
  readonly reason: CartErrorReason;

  /**  */
  readonly violation?: CartViolation;

  /**  */
  readonly details?: Readonly<{
    /**  */
    cartId?: string;
    /**  */
    itemId?: string;
    /**  */
    sku?: string;
  }>;
}

export const REASON_MESSAGES: Record<CartErrorReason, string> = {
  not_found: "Cart not found",
  validation_failed: "Cart validation failed",
  access_denied: "Access to cart denied",
  repository_error: "Cart repository error",
  unknown: "Unknown error",
};

export const REASON_HTTP_STATUS: Record<CartErrorReason, number> = {
  not_found: 404,
  validation_failed: 400,
  access_denied: 403,
  repository_error: 500,
  unknown: 500,
};

/**
 * Cart operation error with typed reasons.
 */
export class CartError extends BaseError {
  /** Error code */
  readonly code: `cart:${CartErrorReason}`;

  /**
   * @param reason - The reason for the cart error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: CartErrorReason, meta?: Omit<CartErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `cart:${reason}`;
  }
}
