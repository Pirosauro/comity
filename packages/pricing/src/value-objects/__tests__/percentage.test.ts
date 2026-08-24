import type { Result } from "@comity/primitives/result";

import { isFailure, isSuccess } from "@comity/primitives/result";
import { describe, expect, it } from "vitest";
import { PricingError } from "../../errors/pricing.js";
import { Percentage } from "../percentage.js";

function percentage(amount: bigint, scale = 0): Percentage {
  const result = Percentage.create(amount, scale);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function failure(amount: bigint, scale: number): Result<Percentage, PricingError> {
  return Percentage.create(amount, scale);
}

describe("Percentage", () => {
  it("should create with an integer rate", () => {
    const result = Percentage.create(20n, 0);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.amount).toBe(20n);
      expect(result.value.scale).toBe(0);
    }
  });

  it("should create with a fractional rate", () => {
    const result = Percentage.create(725n, 2);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.amount).toBe(725n);
      expect(result.value.scale).toBe(2);
    }
  });

  it("should accept a zero rate", () => {
    const result = Percentage.create(0n, 1);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.toString()).toBe("0%");
    }
  });

  it("should normalize a fractional scale by truncation", () => {
    const result = Percentage.create(125n, 1.9);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.scale).toBe(1);
      expect(result.value.toString()).toBe("12.5%");
    }
  });

  it("should reject a negative amount with invalid_percentage", () => {
    const result = failure(-1n, 0);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:invalid_percentage");
    }
  });

  it("should reject a negative scale with invalid_percentage", () => {
    expect(isFailure(failure(10n, -1))).toBe(true);
  });

  it("should reject a non-finite scale with invalid_percentage", () => {
    const nan = failure(10n, Number.NaN);
    const infinity = failure(10n, Number.POSITIVE_INFINITY);

    expect(isFailure(nan)).toBe(true);
    expect(isFailure(infinity)).toBe(true);
    if (isFailure(nan)) {
      expect(nan.error.code).toBe("pricing:invalid_percentage");
    }
  });

  it("should equal a percentage with the same rate at a different scale", () => {
    const a = percentage(200n, 1);
    const b = percentage(20n, 0);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(a)).toBe(true);
  });

  it("should not equal a percentage with a different rate", () => {
    const a = percentage(20n, 0);
    const b = percentage(21n, 0);

    expect(a.equals(b)).toBe(false);
  });

  it("should serialize to a canonical percentage string", () => {
    expect(percentage(20n).toString()).toBe("20%");
    expect(percentage(125n, 1).toString()).toBe("12.5%");
    expect(percentage(725n, 2).toString()).toBe("7.25%");
    expect(percentage(200n, 1).toString()).toBe("20%");
    expect(percentage(5n, 3).toString()).toBe("0.005%");
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new Percentage(100n, 0);
  });
});