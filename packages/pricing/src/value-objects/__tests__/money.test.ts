import type { Result } from "@comity/primitives/result";

import { isFailure, isSuccess } from "@comity/primitives/result";
import { describe, expect, it } from "vitest";
import { PricingError } from "../../errors/pricing.js";
import { Currency } from "../currency.js";
import { Money } from "../money.js";

function currency(code: string): Currency {
  const result = Currency.create(code);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function money(amount: bigint, currencyToUse = eur): Money {
  const result = Money.create(amount, currencyToUse);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

const eur = currency("EUR");
const usd = currency("USD");

describe("Money", () => {
  it("should create with an integer amount in the currency minor unit", () => {
    const result = Money.create(10000n, eur);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.amount).toBe(10000n);
      expect(result.value.currency).toBe(eur);
    }
  });

  it("should accept a zero amount", () => {
    const result = Money.create(0n, eur);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.amount).toBe(0n);
    }
  });

  it("should reject a negative amount with invalid_amount", () => {
    const result: Result<Money, PricingError> = Money.create(-1n, eur);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:invalid_amount");
    }
  });

  it("should interpret the amount at the currency minor-unit precision", () => {
    expect(money(1234n, usd).currency.exponent).toBe(2);
    expect(money(1234n, currency("JPY")).currency.exponent).toBe(0);
    expect(money(1234n, currency("KWD")).currency.exponent).toBe(3);
  });

  it("should equal a money with the same amount and currency", () => {
    const a = money(100n);
    const b = money(100n);

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal a money with different amount or currency", () => {
    const a = money(100n);
    const b = money(200n);
    const c = money(100n, usd);

    expect(a.equals(b)).toBe(false);
    expect(a.equals(c)).toBe(false);
  });

  it("should add money in the same currency", () => {
    const result = money(100n).add(money(25n));

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.amount).toBe(125n);
    }
  });

  it("should reject adding money in a different currency with currency_mismatch", () => {
    const result = money(100n).add(money(25n, usd));

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:currency_mismatch");
    }
  });

  it("should subtract money in the same currency", () => {
    const result = money(100n).subtract(money(40n));

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.amount).toBe(60n);
    }
  });

  it("should reject subtraction that would go negative with invalid_amount", () => {
    const result = money(10n).subtract(money(20n));

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:invalid_amount");
    }
  });

  it("should reject subtracting money in a different currency with currency_mismatch", () => {
    const result = money(100n).subtract(money(25n, usd));

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:currency_mismatch");
    }
  });

  it("should multiply by an integer factor", () => {
    const result = money(50n).multiply(3n);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.amount).toBe(150n);
    }
  });

  it("should multiply by a zero factor", () => {
    const result = money(50n).multiply(0n);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.amount).toBe(0n);
    }
  });

  it("should reject a negative factor with invalid_amount", () => {
    const result = money(50n).multiply(-1n);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:invalid_amount");
    }
  });

  it("should serialize to a stable technical string", () => {
    expect(money(1234n, usd).toString()).toBe("1234 USD");
    expect(money(10000n).toString()).toBe("10000 EUR");
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new Money(100n, eur);
  });
});