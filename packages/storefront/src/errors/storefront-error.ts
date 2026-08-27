import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for storefront errors.
 *
 * @remarks
 * These reasons categorize application-level failures in the storefront.
 * Core module errors are wrapped and re-exposed with their original reasons.
 */
export type StorefrontErrorReason =
  | "invalid_input"
  | "customer_not_found"
  | "address_not_found"
  | "product_not_found"
  | "payment_failed"
  | "order_failed"
  | "internal_error"
  | "compensation_failed";

/**
 * Metadata attached to storefront errors.
 */
export interface StorefrontErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: StorefrontErrorReason;

  /** Optional diagnostic details. */
  readonly details?: Readonly<{
    /** Affected entity identifier. */
    entityId?: string;

    /** Entity type (e.g., "customer", "address", "product", "order"). */
    entityType?: string;

    /** Wrapped error code, if any. */
    wrappedCode?: string;

    /** Wrapped error reason, if any. */
    wrappedReason?: string;
  }>;
}

/**
 * Human-friendly messages mapped by reason.
 */
const REASON_MESSAGES: Record<StorefrontErrorReason, string> = {
  invalid_input: "Invalid input provided",
  customer_not_found: "Customer not found",
  address_not_found: "Address not found",
  product_not_found: "Product not found",
  payment_failed: "Payment processing failed",
  order_failed: "Order processing failed",
  internal_error: "Internal storefront error",
  compensation_failed: "Payment compensation failed",
};

/**
 * Default HTTP status mapped by reason.
 */
const REASON_HTTP_STATUS: Record<StorefrontErrorReason, number> = {
  invalid_input: 400,
  customer_not_found: 404,
  address_not_found: 404,
  product_not_found: 404,
  payment_failed: 402,
  order_failed: 500,
  internal_error: 500,
  compensation_failed: 500,
};

/**
 * Storefront application error.
 *
 * Represents an error at the Application layer that wraps domain errors
 * from Core Modules and adds application-level context.
 */
export class StorefrontError extends BaseError<StorefrontErrorMeta> {
  /** Namespaced error code. */
  readonly code: `storefront:${StorefrontErrorReason}`;

  /**
   * @param reason - The reason for the storefront error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: StorefrontErrorReason, meta?: Omit<StorefrontErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `storefront:${reason}`;
  }
}