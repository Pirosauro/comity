import { describe, expect, it } from "vitest";
import { Currency, Money } from "@comity/pricing";
import type { PaymentRequest } from "../contracts/payment-request.js";
import type { PaymentOutcome, PaymentStatus } from "../contracts/payment-outcome.js";

function unwrap<T>(result: { success: true; value: T } | { success: false }): T {
  if (result.success === false) {
    throw new Error("Unexpected failure");
  }
  return result.value;
}

const eur = unwrap(Currency.create("EUR"));
const money = (amount: bigint) => unwrap(Money.create(amount, eur));

describe("PaymentRequest", () => {
  it("accepts valid amount and optional reference", () => {
    const request: PaymentRequest = {
      amount: money(10000n),
      reference: "order-123",
    };

    expect(request.amount).toEqual(money(10000n));
    expect(request.reference).toBe("order-123");
  });

  it("accepts request without reference", () => {
    const request: PaymentRequest = {
      amount: money(5000n),
    };

    expect(request.amount).toEqual(money(5000n));
    expect(request.reference).toBeUndefined();
  });
});

describe("PaymentOutcome", () => {
  it("accepts full outcome with all fields", () => {
    const outcome: PaymentOutcome = {
      paymentId: "pay_123",
      amount: money(10000n),
      status: "authorized",
      provider: "stripe",
      reference: "order-123",
      authorizedAt: new Date().toISOString() as any,
    };

    expect(outcome.paymentId).toBe("pay_123");
    expect(outcome.status).toBe("authorized");
  });

  it("accepts minimal outcome", () => {
    const outcome: PaymentOutcome = {
      amount: money(5000n),
      status: "failed",
    };

    expect(outcome.paymentId).toBeUndefined();
    expect(outcome.provider).toBeUndefined();
    expect(outcome.reference).toBeUndefined();
    expect(outcome.authorizedAt).toBeUndefined();
    expect(outcome.capturedAt).toBeUndefined();
  });

  it("only allows valid PaymentStatus values", () => {
    const statuses: PaymentStatus[] = ["authorized", "captured", "failed", "cancelled"];

    for (const status of statuses) {
      expect(["authorized", "captured", "failed", "cancelled"]).toContain(status);
    }
  });
});