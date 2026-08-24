import type { Money } from "@comity/pricing";

/**
 * Input required to initiate a payment.
 *
 * Minimal by design: no order, customer, address, or provider-specific data.
 * The Application owns orchestration and maps its context to this shape.
 */
export interface PaymentRequest {
  /** The amount to charge. Currency is embedded in the Money value object. */
  readonly amount: Money;

  /** Opaque caller-owned reference (e.g., order ID, cart ID, idempotency key). */
  readonly reference?: string;
}