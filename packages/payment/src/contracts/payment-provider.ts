import type { Result } from "@comity/primitives/result";
import type { PaymentRequest } from "./payment-request.js";
import type { PaymentOutcome } from "./payment-outcome.js";
import type { PaymentError } from "../errors/payment.js";

/**
 * Provider-agnostic contract for initiating payments.
 *
 * The Application composes this capability to orchestrate checkout without
 * depending on any specific payment provider (Stripe, Adyen, etc.).
 *
 * Implementations belong to Adapters (e.g., {@link @comity/payment-stripe}).
 */
export interface PaymentProvider {
  /**
   * Initiates a payment.
   *
   * @param request - The payment request containing amount and optional reference.
   *
   * @returns A Result containing the PaymentOutcome on success, or a PaymentError
   * on contract-level failure (invalid request, infrastructure failure).
   *
   * Provider declines (e.g., insufficient funds) are represented as
   * {@link PaymentOutcome} with {@link PaymentStatus} "failed", not as errors.
   */
  initiate(request: PaymentRequest): Promise<Result<PaymentOutcome, PaymentError>>;
}