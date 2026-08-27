import type { OrderPaymentSnapshot } from "@comity/order";
import type { PaymentOutcome, PaymentProvider, PaymentRequest } from "@comity/payment";
import type { Result } from "@comity/primitives/result";

import { failure, isSuccess, success } from "@comity/primitives/result";
import { StorefrontError } from "../errors/storefront-error.js";

export interface PaymentOperations {
  initiate(request: PaymentRequest): Promise<Result<PaymentOutcome, StorefrontError>>;
  mapOutcome(outcome: PaymentOutcome): OrderPaymentSnapshot;
}

export class DefaultPaymentOperations implements PaymentOperations {
  readonly #paymentProvider: PaymentProvider;

  constructor(paymentProvider: PaymentProvider) {
    this.#paymentProvider = paymentProvider;
  }

  async initiate(request: PaymentRequest): Promise<Result<PaymentOutcome, StorefrontError>> {
    const result = await this.#paymentProvider.initiate(request);
    if (!isSuccess(result)) {
      return failure(
        new StorefrontError("payment_failed", {
          details: {
            entityType: "payment",
            wrappedCode: result.error.code,
            ...(result.error.meta.reason !== undefined
              ? { wrappedReason: result.error.meta.reason }
              : {}),
          },
          cause: result.error,
        })
      );
    }
    return success(result.value);
  }

  mapOutcome(outcome: PaymentOutcome): OrderPaymentSnapshot {
    return {
      ...(outcome.paymentId !== undefined ? { paymentId: outcome.paymentId } : {}),
      amount: outcome.amount,
      status: outcome.status,
      ...(outcome.provider !== undefined ? { provider: outcome.provider } : {}),
      ...(outcome.reference !== undefined ? { reference: outcome.reference } : {}),
      ...(outcome.authorizedAt !== undefined ? { authorizedAt: outcome.authorizedAt } : {}),
      ...(outcome.capturedAt !== undefined ? { capturedAt: outcome.capturedAt } : {}),
    };
  }
}
