import type { Result } from "@comity/primitives/result";
import type { PriceModifier, PriceModifierKind } from "../contracts/price-modifier.js";
import type { Currency } from "./currency.js";
import type { Percentage } from "./percentage.js";

import { failure, isFailure, success } from "@comity/primitives/result";
import { PricingError } from "../errors/pricing.js";
import { Money } from "./money.js";

const PRICE_MODIFIER_KINDS: ReadonlySet<PriceModifierKind> = new Set([
  "discount",
  "tax",
  "charge",
  "credit",
  "other",
]);

/**
 * Price is a value object representing a calculated price.
 *
 * It has no identity and no lifecycle. Its invariants — `subtotal`,
 * `modifiers`, and `total` must be coherent — are protected by the single
 * creation path: {@link Price.create} applies the modifiers to the subtotal
 * and computes the total internally, so an incoherent `Price` (e.g. a total
 * that does not match the applied modifiers) cannot exist.
 *
 * Pricing is neutral with respect to the business meaning of modifiers: it
 * never interprets `kind` or `component`. It only applies the mathematical
 * adjustment (`add` / `subtract` of a money amount or a percentage rate).
 */
export class Price {
  #subtotal: Money;
  #modifiers: ReadonlyArray<PriceModifier>;
  #total: Money;

  /**
   * Creates a price by applying the modifiers to the subtotal.
   *
   * The total is computed internally: modifiers are validated and applied in
   * input order, and the running total can never go below zero. The
   * resulting `modifiers` array reflects the applied list.
   *
   * @param subtotal - The base money before modifiers.
   * @param modifiers - The modifiers to apply.
   *
   * @returns The price, or a pricing error when a modifier is invalid
   * (`invalid_modifier`), is in a different currency (`currency_mismatch`),
   * or would drive the total below zero (`calculation_failed`).
   */
  static create(
    subtotal: Money,
    modifiers: ReadonlyArray<PriceModifier>
  ): Result<Price, PricingError> {
    for (const modifier of modifiers) {
      const validation = validateModifier(modifier, subtotal.currency);

      if (isFailure(validation)) {
        return validation;
      }
    }

    let running = subtotal.amount;

    for (const modifier of modifiers) {
      const next = applyModifier(running, modifier);

      if (isFailure(next)) {
        return next;
      }

      running = next.value;
    }

    const total = Money.create(running, subtotal.currency);

    if (isFailure(total)) {
      return total;
    }

    return success(new Price(subtotal, modifiers, total.value));
  }

  /**
   * @param subtotal - The base money before modifiers.
   * @param modifiers - The applied modifiers.
   * @param total - The computed total.
   */
  private constructor(subtotal: Money, modifiers: ReadonlyArray<PriceModifier>, total: Money) {
    this.#subtotal = subtotal;
    this.#modifiers = [...modifiers];
    this.#total = total;
  }

  /**
   * Returns the base money before modifiers.
   *
   * @returns The subtotal.
   */
  get subtotal(): Money {
    return this.#subtotal;
  }

  /**
   * Returns the applied modifiers that produced the total.
   *
   * @returns The applied modifiers.
   */
  get modifiers(): ReadonlyArray<PriceModifier> {
    return [...this.#modifiers];
  }

  /**
   * Returns the computed total.
   *
   * @returns The total.
   */
  get total(): Money {
    return this.#total;
  }

  /**
   * Checks if this Price is equal to another Price.
   *
   * @param other - The other Price to compare with.
   *
   * @returns True if subtotal, modifiers, and total are equal, false
   * otherwise.
   */
  equals(other: Price): boolean {
    if (!this.#subtotal.equals(other.subtotal) || !this.#total.equals(other.total)) {
      return false;
    }

    if (this.#modifiers.length !== other.modifiers.length) {
      return false;
    }

    return this.#modifiers.every((modifier, index) =>
      modifiersEqual(modifier, other.modifiers[index])
    );
  }
}

/**
 * Validates a modifier's structure and currency alignment.
 *
 * `kind` and `component` are never interpreted; they are validated only as
 * structure (known kind, present code, coherent adjustment).
 *
 * @param modifier - The modifier to validate.
 * @param baseCurrency - The currency of the base price.
 *
 * @returns A result indicating the validation outcome.
 */
function validateModifier(
  modifier: PriceModifier,
  baseCurrency: Currency
): Result<void, PricingError> {
  if (modifier.code.trim().length === 0) {
    return failure(
      new PricingError("invalid_modifier", {
        details: { field: "code", modifierCode: modifier.code },
      })
    );
  }

  if (!PRICE_MODIFIER_KINDS.has(modifier.kind)) {
    return failure(
      new PricingError("invalid_modifier", {
        details: { field: "kind", modifierCode: modifier.code },
      })
    );
  }

  const adjustment = modifier.adjustment;

  if (adjustment.operation !== "add" && adjustment.operation !== "subtract") {
    return failure(
      new PricingError("invalid_modifier", {
        details: { field: "operation", modifierCode: modifier.code },
      })
    );
  }

  if (adjustment.type === "money") {
    if (!adjustment.amount.currency.equals(baseCurrency)) {
      return failure(
        new PricingError("currency_mismatch", {
          details: {
            field: "amount",
            expectedCurrency: baseCurrency.toString(),
            modifierCode: modifier.code,
          },
        })
      );
    }
  } else if (adjustment.rate.amount === 0n) {
    return failure(
      new PricingError("invalid_modifier", {
        details: { field: "rate", modifierCode: modifier.code },
      })
    );
  }

  return success(undefined);
}

/**
 * Applies a single modifier's adjustment to the running total.
 *
 * The adjustment is pure arithmetic: `money` moves the total by an exact
 * amount, `percentage` moves it by `current × rate`. The `operation`
 * provides the sign. `kind` and `component` are not consulted.
 *
 * @param current - The running total.
 * @param modifier - The modifier to apply.
 *
 * @returns The updated total, or a `calculation_failed` error when a
 * subtractive adjustment would drive the total below zero.
 */
function applyModifier(current: bigint, modifier: PriceModifier): Result<bigint, PricingError> {
  const adjustment = modifier.adjustment;
  const sign = adjustment.operation === "subtract" ? -1n : 1n;

  const delta =
    adjustment.type === "money" ? adjustment.amount.amount : percentDelta(current, adjustment.rate);

  if (sign < 0n && delta > current) {
    return failure(
      new PricingError("calculation_failed", {
        details: {
          modifierCode: modifier.code,
          field: "total",
        },
      })
    );
  }

  return success(current + sign * delta);
}

/**
 * Computes the percentage adjustment of a running total: `current × rate`
 * where the rate is a {@link Percentage} (`amount / 10^scale` percent). The
 * result is rounded half-up to the running total's minor unit.
 *
 * @param current - The running total.
 * @param rate - The percentage rate.
 *
 * @returns The adjustment.
 */
function percentDelta(current: bigint, rate: Percentage): bigint {
  const divisor = 10n ** BigInt(rate.scale + 2);

  return roundHalfUp(current * rate.amount, divisor);
}

/**
 * Rounds a division half-up (away from zero at the midpoint).
 *
 * @param dividend - The dividend (non-negative here).
 * @param divisor - The divisor (positive).
 *
 * @returns The rounded quotient.
 */
function roundHalfUp(dividend: bigint, divisor: bigint): bigint {
  return (dividend + divisor / 2n) / divisor;
}

/**
 * Compares two modifiers structurally.
 *
 * @param a - The first modifier.
 * @param b - The second modifier.
 *
 * @returns True when the modifiers are equal.
 */
function modifiersEqual(a: PriceModifier, b: PriceModifier | undefined): boolean {
  if (b === undefined) {
    return false;
  }

  if (a.code !== b.code || a.kind !== b.kind || a.component !== b.component) {
    return false;
  }

  if (a.adjustment.type !== b.adjustment.type) {
    return false;
  }

  if (a.adjustment.operation !== b.adjustment.operation) {
    return false;
  }

  if (a.adjustment.type === "money" && b.adjustment.type === "money") {
    return a.adjustment.amount.equals(b.adjustment.amount);
  }

  if (a.adjustment.type === "percentage" && b.adjustment.type === "percentage") {
    return a.adjustment.rate.equals(b.adjustment.rate);
  }

  return false;
}
