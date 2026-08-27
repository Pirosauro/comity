import type { Result } from "@comity/primitives/result";
import type { Money } from "@comity/pricing";
import type { StorefrontError } from "../errors/storefront-error.js";

export interface PaymentCompensation {
  readonly paymentId: string;
  readonly amount: Money;
}

export interface PaymentCompensationProvider {
  compensate(payment: PaymentCompensation): Promise<Result<void, StorefrontError>>;
}