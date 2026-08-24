import type { AdjustmentOperation, PriceModifier } from "../../contracts/price-modifier.js";

import { isFailure, isSuccess } from "@comity/primitives/result";
import { describe, expect, it } from "vitest";
import { Currency } from "../currency.js";
import { Money } from "../money.js";
import { Percentage } from "../percentage.js";
import { Price } from "../price.js";

function currency(code: string): Currency {
  const result = Currency.create(code);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function percentage(amount: bigint, scale = 0): Percentage {
  const result = Percentage.create(amount, scale);

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

function price(subtotal: bigint, modifiers = []): Price {
  const result = Price.create(money(subtotal), modifiers);

  if (isFailure(result)) {
    throw new Error("Unexpected failure");
  }

  return result.value;
}

function moneyModifier(
  amount: bigint,
  operation: AdjustmentOperation,
  code = "money",
  overrides: Record<string, unknown> = {}
): PriceModifier {
  return {
    code,
    kind: "charge",
    adjustment: { type: "money", amount: money(amount), operation },
    ...overrides,
  } as PriceModifier;
}

function percentModifier(
  rate: bigint,
  operation: AdjustmentOperation,
  code = "percent",
  scale = 0,
  overrides: Record<string, unknown> = {}
): PriceModifier {
  return {
    code,
    kind: "charge",
    adjustment: { type: "percentage", rate: percentage(rate, scale), operation },
    ...overrides,
  } as PriceModifier;
}

const eur = currency("EUR");
const usd = currency("USD");

describe("Price", () => {
  it("should compute the total from the subtotal when no modifiers are applied", () => {
    const result = Price.create(money(10000n), []);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.subtotal.equals(money(10000n))).toBe(true);
      expect(result.value.total.equals(money(10000n))).toBe(true);
      expect(result.value.modifiers).toEqual([]);
    }
  });

  it("should add an absolute amount with an add operation", () => {
    const result = Price.create(money(10000n), [moneyModifier(500n, "add")]);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.total.amount).toBe(10500n);
    }
  });

  it("should subtract an absolute amount with a subtract operation", () => {
    const result = Price.create(money(10000n), [moneyModifier(500n, "subtract")]);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.total.amount).toBe(9500n);
    }
  });

  it("should apply a percentage rate with an add operation", () => {
    const result = Price.create(money(10000n), [percentModifier(10n, "add")]);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.total.amount).toBe(11000n);
    }
  });

  it("should apply a percentage rate with a subtract operation", () => {
    const result = Price.create(money(10000n), [percentModifier(10n, "subtract")]);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.total.amount).toBe(9000n);
    }
  });

  it("should apply a fractional percentage rate", () => {
    const result = Price.create(money(10000n), [percentModifier(725n, "add", "tax", 2)]);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.total.amount).toBe(10725n);
    }
  });

  it("should keep the input order", () => {
    const result = Price.create(money(10000n), [
      moneyModifier(100n, "add", "fee"),
      percentModifier(10n, "add", "tax"),
    ]);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.total.amount).toBe(11110n);
      expect(result.value.modifiers.map((m) => m.code)).toEqual(["fee", "tax"]);
    }
  });

  it("should compute the total internally and keep it coherent", () => {
    const result = Price.create(money(10000n), [
      moneyModifier(1000n, "subtract", "discount"),
      percentModifier(10n, "add", "tax"),
    ]);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.total.amount).toBe(9900n);
      expect(result.value.total.currency.equals(eur)).toBe(true);
      expect(result.value.modifiers.map((m) => m.code)).toEqual(["discount", "tax"]);
    }
  });

  it("should reject a money modifier in a different currency with currency_mismatch", () => {
    const result = Price.create(money(10000n), [
      moneyModifier(100n, "add", "fee", { adjustment: { type: "money", amount: money(100n, usd), operation: "add" } }),
    ]);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:currency_mismatch");
    }
  });

  it("should reject a percentage modifier with a zero rate with invalid_modifier", () => {
    const result = Price.create(money(10000n), [percentModifier(0n, "add")]);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:invalid_modifier");
    }
  });

  it("should reject an empty code with invalid_modifier", () => {
    const result = Price.create(money(10000n), [moneyModifier(100n, "add", "   ")]);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:invalid_modifier");
    }
  });

  it("should reject an unknown kind with invalid_modifier", () => {
    const result = Price.create(money(10000n), [
      moneyModifier(100n, "add", "x", { kind: "surcharge" }),
    ]);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:invalid_modifier");
    }
  });

  it("should reject an unknown operation with invalid_modifier", () => {
    const result = Price.create(money(10000n), [
      moneyModifier(100n, "add", "x", { adjustment: { type: "money", amount: money(100n), operation: "multiply" } }),
    ]);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:invalid_modifier");
    }
  });

  it("should reject a money subtraction that exceeds the base with calculation_failed", () => {
    const result = Price.create(money(100n), [moneyModifier(200n, "subtract")]);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:calculation_failed");
    }
  });

  it("should reject a percentage subtraction that exceeds the base with calculation_failed", () => {
    const result = Price.create(money(100n), [percentModifier(200n, "subtract")]);

    expect(isFailure(result)).toBe(true);
    if (isFailure(result)) {
      expect(result.error.code).toBe("pricing:calculation_failed");
    }
  });

  it("should keep the subtotal and total immutable", () => {
    const modifiers = [moneyModifier(1000n, "add")];
    const result = Price.create(money(10000n), modifiers);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      expect(result.value.modifiers).not.toBe(modifiers);
    }
  });

  it("should preserve context fields on the applied modifiers", () => {
    const result = Price.create(money(10000n), [
      moneyModifier(1000n, "subtract", "discount-10", {
        label: "10 EUR off",
        kind: "discount",
        component: "checkout",
      }),
    ]);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      const applied = result.value.modifiers[0];
      expect(applied?.label).toBe("10 EUR off");
      expect(applied?.kind).toBe("discount");
      expect(applied?.component).toBe("checkout");
    }
  });

  it("should equal a price with the same subtotal, modifiers, and total", () => {
    const a = price(10000n, [moneyModifier(1000n, "subtract")]);
    const b = price(10000n, [moneyModifier(1000n, "subtract")]);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(a)).toBe(true);
  });

  it("should equal a price with the same percentage modifiers", () => {
    const a = price(10000n, [percentModifier(10n, "add")]);
    const b = price(10000n, [percentModifier(10n, "add")]);

    expect(a.equals(b)).toBe(true);
  });

  it("should not equal a price with a different number of modifiers but the same total", () => {
    const a = price(10000n, [moneyModifier(500n, "add")]);
    const b = price(10000n, [moneyModifier(300n, "add"), moneyModifier(200n, "add")]);

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a price with a different subtotal", () => {
    const a = price(10000n, [moneyModifier(1000n, "subtract")]);
    const b = price(9000n, [moneyModifier(1000n, "subtract")]);

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a price with a different modifier amount", () => {
    const a = price(10000n, [moneyModifier(1000n, "subtract")]);
    const b = price(10000n, [moneyModifier(500n, "subtract")]);

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a price with a different operation", () => {
    const a = price(10000n, [moneyModifier(1000n, "add")]);
    const b = price(10000n, [moneyModifier(1000n, "subtract")]);

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a price with a different modifier label", () => {
    const a = price(10000n, [moneyModifier(1000n, "add", "fee", { label: "handling" })]);
    const b = price(10000n, [moneyModifier(1000n, "add")]);

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a price with a different component", () => {
    const a = price(10000n, [moneyModifier(1000n, "add", "fee", { component: "shipping" })]);
    const b = price(10000n, [moneyModifier(1000n, "add")]);

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a price with a different number of modifiers", () => {
    const a = price(10000n, [moneyModifier(1000n, "subtract")]);
    const b = price(10000n, [
      moneyModifier(1000n, "subtract"),
      percentModifier(10n, "add"),
    ]);

    expect(a.equals(b)).toBe(false);
  });

  it("should not equal a price with a money adjustment against a percentage one", () => {
    const a = price(10000n, [moneyModifier(1000n, "add")]);
    const b = price(10000n, [percentModifier(10n, "add")]);

    expect(a.equals(b)).toBe(false);
  });

  it("should not allow bypassing validation through the constructor", () => {
    // @ts-expect-error the constructor is private; creation goes through create()
    new Price(money(10000n), [], money(10000n));
  });
});