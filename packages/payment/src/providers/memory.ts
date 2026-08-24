import type { Result } from "@comity/primitives/result";
import type { PaymentProvider } from "../contracts/payment-provider.js";
import type { PaymentRequest } from "../contracts/payment-request.js";
import type { PaymentOutcome, PaymentStatus } from "../contracts/payment-outcome.js";

import { success, failure } from "@comity/primitives/result";
import { PaymentError } from "../errors/payment.js";
import { Instant } from "@comity/primitives/time";

/**
 * In-memory implementation of {@link PaymentProvider} for testing and
 * development purposes.
 *
 * Note: This implementation is not suitable for production use. It does not
 * persist payments and is not shared across multiple instances of the
 * application. It provides deterministic behavior for testing and local
 * development.
 *
 * Behavior:
 * - Accepts any valid {@link PaymentRequest}.
 * - Returns a successful {@link PaymentOutcome} with status "authorized" by
 *   default, or "captured" if the reference starts with "capture:".
 * - Returns "failed" if the reference starts with "fail:".
 * - Returns "cancelled" if the reference starts with "cancel:".
 * - Generates a deterministic paymentId from the reference.
 * - Returns {@link PaymentError} with reason "invalid_request" for invalid
 *   amounts (zero or negative).
 */
export class MemoryPaymentProvider implements PaymentProvider {
  /**
   * @inheritdoc
   */
  async initiate(request: PaymentRequest): Promise<Result<PaymentOutcome, PaymentError>> {
    // Validate request
    if (request.amount.amount <= 0n) {
      return failure(
        new PaymentError("invalid_request", {
          details: { reference: request.reference },
        })
      );
    }

    // Determine outcome from reference prefix (for deterministic testing)
    let status: PaymentStatus = "authorized";
    if (request.reference?.startsWith("capture:")) {
      status = "captured";
    } else if (request.reference?.startsWith("fail:")) {
      status = "failed";
    } else if (request.reference?.startsWith("cancel:")) {
      status = "cancelled";
    }

    const now = Instant.now();
    const paymentId = request.reference
      ? `pay_${request.reference.replace(/[^a-zA-Z0-9]/g, "_")}`
      : `pay_${now.epochMilliseconds}`;

    const outcome: PaymentOutcome = {
      paymentId,
      amount: request.amount,
      status,
      provider: "memory",
      reference: request.reference ?? undefined,
      authorizedAt: status === "authorized" || status === "captured" ? now : undefined,
      capturedAt: status === "captured" ? now : undefined,
    };

    return success(outcome);
  }
}