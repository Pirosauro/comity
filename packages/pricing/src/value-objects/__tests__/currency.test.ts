import type { Result } from "@comity/primitives/result";

import { isFailure, isSuccess } from "@comity/primitives/result";
import { describe, expect, it } from "vitest";
import { PricingError } from "../../errors/pricing.js";
import { Currency } from "../currency.js";

function currency(code: string): Currency {
  const result = Currency.create(code);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function failure(code: string): Result<Currency, PricingError> {
  return Currency.create(code);
}

describe("Currency", () => {
  it("should create with a valid code", () => {
    const result = Currency.create("EUR");

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.code).toBe("EUR");
      expect(result.value.toString()).toBe("EUR");
    }
  });

  it("should normalize lowercase codes to uppercase", () => {
    const result = Currency.create("usd");

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.code).toBe("USD");
    }
  });

  it("should expose the minor-unit exponent of the currency", () => {
    expect(currency("USD").exponent).toBe(2);
    expect(currency("EUR").exponent).toBe(2);
    expect(currency("JPY").exponent).toBe(0);
    expect(currency("KWD").exponent).toBe(3);
    expect(currency("BHD").exponent).toBe(3);
    expect(currency("CLF").exponent).toBe(4);
  });

  it("should accept special ISO 4217 codes", () => {
    expect(currency("XTS").code).toBe("XTS");
    expect(currency("XXX").code).toBe("XXX");
    expect(currency("XAU").code).toBe("XAU");
  });

  it("should reject an unknown code with invalid_currency", () => {
    const result = failure("FOO");

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error).toBeInstanceOf(PricingError);
      expect(result.error.code).toBe("pricing:invalid_currency");
      expect(result.error.meta.reason).toBe("invalid_currency");
    }
  });

  it("should reject an empty string", () => {
    expect(isFailure(Currency.create(""))).toBe(true);
  });

  it("should reject a historic code", () => {
    expect(isFailure(Currency.create("HRK"))).toBe(true);
    expect(isFailure(Currency.create("SLL"))).toBe(true);
    expect(isFailure(Currency.create("VEF"))).toBe(true);
  });

  it("should equal a currency with the same code", () => {
    const a = currency("EUR");
    const b = currency("eur");

    expect(a.equals(b)).toBe(true);
    expect(a.equals(a)).toBe(true);
  });

  it("should not equal a currency with a different code", () => {
    const a = currency("EUR");
    const b = currency("USD");

    expect(a.equals(b)).toBe(false);
  });

  it("should expose the invalid code in details", () => {
    const result = failure("FOO");

    if (isFailure(result)) {
      expect(result.error.meta.details).toEqual({
        field: "currency",
        currency: "FOO",
      });
    }
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new Currency("EUR");
  });
});