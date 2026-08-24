import type { Instant } from "@comity/primitives/time";
import type { Money } from "@comity/pricing";

/**
 * Payment lifecycle status.
 *
 * Mirrors {@link OrderPaymentStatus} from {@link @comity/order} to ensure
 * mechanical mapping between payment outcomes and order snapshots.
 *
 * Do not add: pending, processing, refunded, expired.
 * Those are provider-specific or workflow states, not core outcomes.
 */
export type PaymentStatus = "authorized" | "captured" | "failed" | "cancelled";

/**
 * Outcome of a payment initiation.
 *
 * Mirrors {@link OrderPaymentSnapshot} from {@link @comity/order} to enable
 * mechanical mapping. The Application is responsible for transforming this
 * outcome into an {@link OrderPaymentSnapshot} for {@link Order.attachPayment}.
 *
 * Duplication is intentional: the Order must not depend on the Payment module.
 */
export interface PaymentOutcome {
  /** Payment identifier assigned by the provider, if available. */
  readonly paymentId?: string | undefined;

  /** The amount that was charged. */
  readonly amount: Money;

  /** The final outcome status. */
  readonly status: PaymentStatus;

  /** The provider identifier, if known. */
  readonly provider?: string | undefined;

  /** The caller's opaque reference echoed back. */
  readonly reference?: string | undefined;

  /** Timestamp when the payment was authorized, if applicable. */
  readonly authorizedAt?: Instant | undefined;

  /** Timestamp when the payment was captured, if applicable. */
  readonly capturedAt?: Instant | undefined;
}