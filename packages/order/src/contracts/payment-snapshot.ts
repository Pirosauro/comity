import type { Instant } from "@comity/primitives/time";
import type { Money } from "@comity/pricing";

/**
 * Outcome of a payment at the time the snapshot was captured.
 *
 * Mirrors the confirmed `@comity/payment` lifecycle without importing any
 * payment type: the order records the factual outcome only.
 */
export type OrderPaymentStatus =
  | "authorized"
  | "captured"
  | "failed"
  | "cancelled";

/**
 * Immutable historical fact about the payment of an order.
 *
 * A plain, owned representation of the payment outcome. It is NOT a payment
 * entity and it is not a reference to `@comity/payment`: once the snapshot is
 * attached the order MUST NOT depend on the payment module for its content.
 *
 * Only reconciling facts are preserved. The order never coordinates or
 * recollects a payment; it only records the outcome the Application Layer
 * attaches after processing.
 */
export interface OrderPaymentSnapshot {
  /** Reference to the payment identifier managed by the payment module. */
  readonly paymentId?: string;

  /** The charged amount. */
  readonly amount: Money;

  /** The payment outcome at capture time. */
  readonly status: OrderPaymentStatus;

  /** The payment provider identifier, if known. */
  readonly provider?: string;

  /** The provider-side reference (e.g. transaction/authorization token). */
  readonly reference?: string;

  /** The timestamp when the payment was authorized, if known. */
  readonly authorizedAt?: Instant;

  /** The timestamp when the payment was captured, if known. */
  readonly capturedAt?: Instant;
}
