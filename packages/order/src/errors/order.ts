import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Order error reason.
 *
 * Contains only domain conditions owned by the Order aggregate. Not-found is
 * a `null` repository result, never an error; infrastructure and
 * cross-module failures (`repository_error`, `insufficient_stock`,
 * `product_not_available`, coupon validation) belong to other layers/modules.
 */
export type OrderErrorReason =
  | "invalid_quantity"
  | "invalid_item"
  | "invalid_status_transition"
  | "shipping_destination_immutable"
  | "ambiguous_shipping_destination";

/**
 * Order error metadata.
 */
interface OrderErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: OrderErrorReason;

  /** Contextual details. */
  readonly details?: Readonly<{
    /** Affected order ID. */
    orderId?: string;

    /** Affected item ID. */
    itemId?: string;

    /** Invalid input field. */
    field?: string;

    /** Source status of an invalid transition. */
    from?: string;

    /** Target status of an invalid transition. */
    to?: string;
  }>;
}

const REASON_MESSAGES: Record<OrderErrorReason, string> = {
  invalid_quantity: "Invalid order item quantity",
  invalid_item: "Order item not found",
  invalid_status_transition: "Invalid order status transition",
  shipping_destination_immutable: "Shipping destination cannot be changed in the current order status",
  ambiguous_shipping_destination: "Order must contain exactly one shipping destination",
};

const REASON_HTTP_STATUS: Record<OrderErrorReason, number> = {
  invalid_quantity: 400,
  invalid_item: 400,
  invalid_status_transition: 409,
  shipping_destination_immutable: 409,
  ambiguous_shipping_destination: 409,
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
