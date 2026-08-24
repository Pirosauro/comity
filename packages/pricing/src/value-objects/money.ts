import type { Result } from "@comity/primitives/result";
import type { Currency } from "./currency.js";

import { failure, success } from "@comity/primitives/result";
import { PricingError } from "../errors/pricing.js";

/**
 * Money is a value object representing an amount of money.
 *
 * The amount is an integer count of the currency's minor unit: one minor unit
 * equals `10^-currency.exponent` of one major unit (e.g. `amount` 1234 with
 * `USD` represents 12.34 USD, `amount` 1234 with `JPY` represents 1234 JPY).
 * Integer minor units keep arithmetic exact — no floating-point `number` is
 * used.
 *
 * Precision coherence with the currency is inherent to the representation: any
 * non-negative integer is a whole number of minor units for the currency. The
 * `invalid_precision` reason is reserved for future scaled operations (e.g.
 * fractional-quantity calculations with a rounding policy).
 */
export class Money {
  #amount: bigint;
  #currency: Currency;

  /**
   * Creates Money from an amount in the currency's minor unit.
   *
   * The Value Object is always created in a valid state; a negative amount
   * yields an `invalid_amount` failure instead of throwing.
   *
   * @param amount - The amount in the currency's minor unit.
   * @param currency - The currency of the amount.
   *
   * @returns The Money, or an `invalid_amount` error when the amount is
   * negative.
   */
  static create(amount: bigint, currency: Currency): Result<Money, PricingError> {
    if (amount < 0n) {
      return failure(
        new PricingError("invalid_amount", {
          details: { field: "amount" },
        })
      );
    }

    return success(new Money(amount, currency));
  }

  /**
   * @param amount - The amount in the currency's minor unit.
   * @param currency - The currency of the amount.
   */
  private constructor(amount: bigint, currency: Currency) {
    this.#amount = amount;
    this.#currency = currency;
  }

  /**
   * Returns the amount in the currency's minor unit.
   *
   * @returns The amount.
   */
  get amount(): bigint {
    return this.#amount;
  }

  /**
   * Returns the currency of the amount.
   *
   * @returns The currency.
   */
  get currency(): Currency {
    return this.#currency;
  }

  /**
   * Checks if this Money is equal to another Money.
   *
   * @param other - The other Money to compare with.
   *
   * @returns True if the amounts and currencies are equal, false otherwise.
   */
  equals(other: Money): boolean {
    return this.#amount === other.amount && this.#currency.equals(other.currency);
  }

  /**
   * Adds another Money to this Money.
   *
   * @param other - The Money to add.
   *
   * @returns The sum, or a `currency_mismatch` error when the currencies
   * differ.
   */
  add(other: Money): Result<Money, PricingError> {
    if (!this.#currency.equals(other.currency)) {
      return failure(this.#currencyMismatch());
    }

    return success(new Money(this.#amount + other.amount, this.#currency));
  }

  /**
   * Subtracts another Money from this Money.
   *
   * @param other - The Money to subtract.
   *
   * @returns The difference, a `currency_mismatch` error when the currencies
   * differ, or an `invalid_amount` error when the result would be negative.
   */
  subtract(other: Money): Result<Money, PricingError> {
    if (!this.#currency.equals(other.currency)) {
      return failure(this.#currencyMismatch());
    }

    const result = this.#amount - other.amount;

    if (result < 0n) {
      return failure(
        new PricingError("invalid_amount", {
          details: { field: "amount" },
        })
      );
    }

    return success(new Money(result, this.#currency));
  }

  /**
   * Multiplies this Money by an integer factor.
   *
   * The factor is an integer (a quantity expressed in whole minor units of
   * its own measure). Fractional quantities (kg, meters, consumption, time)
   * are NOT supported by Money: they are owned by their domain module, and
   * pricing may introduce a dedicated calculation if a real need emerges.
   *
   * @param factor - The integer factor to multiply by.
   *
   * @returns The product, or an `invalid_amount` error when the factor is
   * negative.
   */
  multiply(factor: bigint): Result<Money, PricingError> {
    if (factor < 0n) {
      return failure(
        new PricingError("invalid_amount", {
          details: { field: "factor" },
        })
      );
    }

    return success(new Money(this.#amount * factor, this.#currency));
  }

  /**
   * Returns a stable technical serialization: the minor-unit amount followed
   * by the currency code (e.g. `1234 USD`).
   *
   * This is a technical representation, NEVER a display format. Human /
   * localized rendering (`10€`, `$20`, `20€`) is the responsibility of a
   * dedicated formatter at the boundaries, out of scope for this Value
   * Object.
   *
   * @returns The string representation.
   */
  toString(): string {
    return `${this.#amount.toString()} ${this.#currency.toString()}`;
  }

  /**
   * Builds a `currency_mismatch` error for this Money.
   *
   * @returns The pricing error.
   */
  #currencyMismatch(): PricingError {
    return new PricingError("currency_mismatch", {
      details: {
        field: "amount",
        expectedCurrency: this.#currency.toString(),
      },
    });
  }
}