import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for payment contract errors.
 *
 * Initial MVP reason set. Additional reasons may be added as additive
 * changes per `errors.md` §10.
 *
 * Provider declines (e.g., insufficient funds) are NOT errors — they are
 * represented as {@link PaymentOutcome} with {@link PaymentStatus} "failed".
 * This keeps the core reason set provider-agnostic.
 */
export type PaymentErrorReason = "invalid_request" | "internal_error";

/**
 * Metadata attached to payment errors.
 */
export interface PaymentErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: PaymentErrorReason;

  /** Optional diagnostic details. */
  readonly details?: Readonly<{
    /** Opaque reference from the failed request, if any. */
    reference?: string;
  }>;
}

/**
 * Human-friendly messages mapped by reason.
 */
const REASON_MESSAGES: Record<PaymentErrorReason, string> = {
  invalid_request: "Invalid payment request",
  internal_error: "Payment infrastructure error",
};

/**
 * Default HTTP status mapped by reason.
 */
const REASON_HTTP_STATUS: Record<PaymentErrorReason, number> = {
  invalid_request: 400,
  internal_error: 500,
};

/**
 * Payment contract error.
 *
 * Represents a failure at the payment contract boundary — not a provider
 * decline, which is represented as a {@link PaymentOutcome} with
 * {@link PaymentStatus} "failed".
 *
 * This is a Core Module error, following the single-error-class pattern
 * per {@link errors.md} §6.
 */
export class PaymentError extends BaseError<PaymentErrorMeta> {
  /** Namespaced error code. */
  readonly code: `payment:${PaymentErrorReason}`;

  /**
   * @param reason - The reason for the payment error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: PaymentErrorReason, meta?: Omit<import("@comity/primitives/errors").ErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `payment:${reason}`;
  }
}