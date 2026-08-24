import type { Result } from "@comity/primitives/result";
import type { AdjustmentOperation, PriceModifier } from "../../contracts/price-modifier.js";

import { isFailure, isSuccess } from "@comity/primitives/result";
import { describe, expect, it } from "vitest";
import { PricingError } from "../../errors/pricing.js";
import { Currency } from "../../value-objects/currency.js";
import { Money } from "../../value-objects/money.js";
import { Percentage } from "../../value-objects/percentage.js";
import { Price } from "../../value-objects/price.js";
import { calculatePrice } from "../calculate-price.js";

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

const eur = currency("EUR");
const usd = currency("USD");

function expectFailure(result: Result<unknown, PricingError>): PricingError {
  if (isSuccess(result)) {
    throw new Error("Expected a failure");
  }

  return result.error;
}

function expectPrice(
  result: Result<unknown, PricingError>,
  total: bigint,
  modifiers: string[] = []
): void {
  expect(isSuccess(result)).toBe(true);
  if (isSuccess(result)) {
    const value = result.value as Price;
    expect(value.total.amount).toBe(total);
    expect(value.modifiers.map((m) => m.code)).toEqual(modifiers);
  }
}

function moneyAdjustment(
  amount: bigint,
  operation: AdjustmentOperation,
  code = "money"
): PriceModifier {
  return {
    code,
    kind: "charge",
    adjustment: { type: "money", amount: money(amount), operation },
  };
}

function percentageAdjustment(
  rate: bigint,
  operation: AdjustmentOperation,
  code = "percentage",
  scale = 0
): PriceModifier {
  return {
    code,
    kind: "charge",
    adjustment: { type: "percentage", rate: percentage(rate, scale), operation },
  };
}

describe("calculatePrice", () => {
  describe("basic calculation", () => {
    it("should return the base as total with no modifiers", () => {
      const result = calculatePrice(money(10000n), []);

      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value.subtotal.amount).toBe(10000n);
        expect(result.value.total.amount).toBe(10000n);
        expect(result.value.modifiers).toEqual([]);
      }
    });

    it("should add an absolute amount with an add operation", () => {
      expectPrice(calculatePrice(money(10000n), [moneyAdjustment(500n, "add")]), 10500n, [
        "money",
      ]);
    });

    it("should subtract an absolute amount with a subtract operation", () => {
      expectPrice(
        calculatePrice(money(10000n), [moneyAdjustment(1000n, "subtract", "discount")]),
        9000n,
        ["discount"]
      );
    });

    it("should apply a percentage rate with an add operation", () => {
      expectPrice(
        calculatePrice(money(10000n), [percentageAdjustment(10n, "add", "fee")]),
        11000n,
        ["fee"]
      );
    });

    it("should apply a percentage rate with a subtract operation", () => {
      expectPrice(
        calculatePrice(money(10000n), [percentageAdjustment(10n, "subtract", "discount")]),
        9000n,
        ["discount"]
      );
    });

    it("should round percent deltas half-up", () => {
      const result = calculatePrice(money(9999n), [percentageAdjustment(7n, "add", "tax", 2)]);

      expectPrice(result, 10006n, ["tax"]);
    });

    it("should floor percent deltas below the half", () => {
      const result = calculatePrice(money(10001n), [percentageAdjustment(7n, "add", "tax", 2)]);

      expectPrice(result, 10008n, ["tax"]);
    });
  });

  describe("ordering", () => {
    it("should apply modifiers in input order", () => {
      const base = money(10000n);
      const input: PriceModifier[] = [
        moneyAdjustment(1000n, "subtract", "discount"),
        percentageAdjustment(10n, "add", "tax"),
      ];

      const result = calculatePrice(base, input);

      expectPrice(result, 9900n, ["discount", "tax"]);
    });

    it("should keep the input order of the applied modifiers", () => {
      const result = calculatePrice(money(10000n), [
        moneyAdjustment(100n, "subtract", "d-a"),
        moneyAdjustment(200n, "subtract", "d-b"),
      ]);

      expectPrice(result, 9700n, ["d-a", "d-b"]);
    });

    it("should be deterministic for the same input", () => {
      const modifiers: PriceModifier[] = [
        percentageAdjustment(10n, "add", "tax"),
        moneyAdjustment(1000n, "subtract", "discount"),
      ];

      const first = calculatePrice(money(10000n), modifiers);
      const second = calculatePrice(money(10000n), modifiers);

      expect(isSuccess(first)).toBe(true);
      expect(isSuccess(second)).toBe(true);
      if (isSuccess(first) && isSuccess(second)) {
        expect(second.value.total.equals(first.value.total)).toBe(true);
        expect(second.value.modifiers.map((m) => m.code)).toEqual(
          first.value.modifiers.map((m) => m.code)
        );
      }
    });
  });

  describe("validation", () => {
    it("should reject an empty code with invalid_modifier", () => {
      const error = expectFailure(
        calculatePrice(money(10000n), [moneyAdjustment(100n, "add", "  ")])
      );

      expect(error.code).toBe("pricing:invalid_modifier");
    });

    it("should reject an unknown kind with invalid_modifier", () => {
      const error = expectFailure(
        calculatePrice(money(10000n), [
          { ...moneyAdjustment(100n, "add", "x"), kind: "surcharge" } as PriceModifier,
        ])
      );

      expect(error.code).toBe("pricing:invalid_modifier");
    });

    it("should reject a percentage modifier with a zero rate", () => {
      const error = expectFailure(
        calculatePrice(money(10000n), [percentageAdjustment(0n, "add")])
      );

      expect(error.code).toBe("pricing:invalid_modifier");
    });

    it("should reject a money modifier in a different currency with currency_mismatch", () => {
      const error = expectFailure(
        calculatePrice(money(10000n), [
          {
            code: "x",
            kind: "charge",
            adjustment: { type: "money", amount: money(100n, usd), operation: "add" },
          },
        ])
      );

      expect(error.code).toBe("pricing:currency_mismatch");
    });
  });

  describe("negative totals", () => {
    it("should reject a money subtraction that exceeds the base with calculation_failed", () => {
      const error = expectFailure(
        calculatePrice(money(100n), [moneyAdjustment(200n, "subtract")])
      );

      expect(error.code).toBe("pricing:calculation_failed");
    });

    it("should reject a percentage subtraction that exceeds the base with calculation_failed", () => {
      const error = expectFailure(
        calculatePrice(money(100n), [percentageAdjustment(200n, "subtract")])
      );

      expect(error.code).toBe("pricing:calculation_failed");
    });
  });

  describe("result integrity", () => {
    it("should return a fresh modifiers array", () => {
      const modifiers: PriceModifier[] = [moneyAdjustment(100n, "add")];
      const result = calculatePrice(money(10000n), modifiers);

      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value.modifiers).not.toBe(modifiers);
      }
    });

    it("should return Money value objects", () => {
      const result = calculatePrice(money(10000n), [moneyAdjustment(1000n, "subtract")]);

      expect(isSuccess(result)).toBe(true);
      if (isSuccess(result)) {
        expect(result.value.subtotal).toBeInstanceOf(Money);
        expect(result.value.total).toBeInstanceOf(Money);
      }
    });
  });
});