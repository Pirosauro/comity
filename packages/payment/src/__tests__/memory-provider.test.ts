import { beforeEach, describe, expect, it } from "vitest";
import { isFailure, isSuccess } from "@comity/primitives/result";
import { Currency, Money } from "@comity/pricing";
import { Instant } from "@comity/primitives/time";
import { MemoryPaymentProvider } from "../providers/memory.js";
import { PaymentStatus } from "../contracts/payment-outcome.js";
import type { PaymentRequest } from "../contracts/payment-request.js";

function unwrap<T>(result: { success: true; value: T } | { success: false }): T {
  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }
  return result.value;
}

const eur = unwrap(Currency.create("EUR"));
const money = (amount: bigint): import("@comity/pricing").Money => unwrap(Money.create(amount, eur));

function makeRequest(overrides: Partial<PaymentRequest> = {}): PaymentRequest {
  return {
    amount: money(10000n),
    ...overrides,
  };
}

describe("MemoryPaymentProvider", () => {
  let provider: MemoryPaymentProvider;

  beforeEach(() => {
    provider = new MemoryPaymentProvider();
  });

  it("returns authorized outcome for valid request", async () => {
    const request = makeRequest({ reference: "order-1" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.paymentId).toBe("pay_order_1");
      expect(result.value.amount).toEqual(money(10000n));
      expect(result.value.status).toBe("authorized");
      expect(result.value.provider).toBe("memory");
      expect(result.value.reference).toBe("order-1");
      expect(result.value.authorizedAt).toBeInstanceOf(Instant);
      expect(result.value.capturedAt).toBeUndefined();
    }
  });

  it("returns captured outcome when reference starts with capture:", async () => {
    const request = makeRequest({ reference: "capture:order-1" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.status).toBe("captured");
      expect(result.value.capturedAt).toBeInstanceOf(Instant);
      expect(result.value.authorizedAt).toBeInstanceOf(Instant);
    }
  });

  it("returns failed outcome when reference starts with fail:", async () => {
    const request = makeRequest({ reference: "fail:order-1" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.status).toBe("failed");
    }
  });

  it("returns cancelled outcome when reference starts with cancel:", async () => {
    const request = makeRequest({ reference: "cancel:order-1" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.status).toBe("cancelled");
    }
  });

  it("returns paymentId based on reference", async () => {
    const request = makeRequest({ reference: "test-order" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.paymentId).toBe("pay_test_order");
    }
  });

  it("generates paymentId from timestamp when no reference", async () => {
    const request = makeRequest({ reference: undefined });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.paymentId).toMatch(/^pay_\d+$/);
    }
  });

  it("includes provider in outcome", async () => {
    const request = makeRequest({ reference: "order-1" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.provider).toBe("memory");
    }
  });

  it("echoes reference in outcome", async () => {
    const request = makeRequest({ reference: "my-ref" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.reference).toBe("my-ref");
    }
  });

  it("returns correct status for failed outcome", async () => {
    const request = makeRequest({ reference: "fail:test" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.status).toBe("failed");
      expect(["authorized", "captured", "failed", "cancelled"]).toContain(result.value.status);
    }
  });

  it("returns correct status for cancelled outcome", async () => {
    const request = makeRequest({ reference: "cancel:test" });
    const result = await provider.initiate(request);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.status).toBe("cancelled");
    }
  });
});