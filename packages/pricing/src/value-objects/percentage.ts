import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { PricingError } from "../errors/pricing.js";

/**
 * Percentage is a value object representing a percentage rate.
 *
 * The internal representation is a scaled integer: the rate is stored as
 * `amount / 10^scale` percent (e.g. 12.5% is `amount` 125 at `scale` 1). The
 * scaling is a representation detail; the contract exposes the rate as a
 * percentage with an arbitrary non-negative scale. A percentage is always
 * created in a valid state: a negative amount, a negative scale, or a
 * non-finite scale yields an `invalid_percentage` failure instead of throwing.
 */
export class Percentage {
  #amount: bigint;
  #scale: number;

  /**
   * Creates a percentage from a scaled integer rate.
   *
   * The scale is normalized to an integer before construction (fractional
   * scales are truncated). The Value Object is always created in a valid
   * state; a negative amount, a negative scale, or a non-finite scale yields
   * an `invalid_percentage` failure instead of throwing.
   *
   * @param amount - The rate as `amount / 10^scale` percent.
   * @param scale - The scale of the amount.
   *
   * @returns The percentage, or an `invalid_percentage` error when the rate
   * is negative or the scale is invalid.
   */
  static create(amount: bigint, scale: number): Result<Percentage, PricingError> {
    if (amount < 0n) {
      return failure(
        new PricingError("invalid_percentage", {
          details: { field: "amount" },
        })
      );
    }

    if (!Number.isFinite(scale)) {
      return failure(
        new PricingError("invalid_percentage", {
          details: { field: "scale" },
        })
      );
    }

    const normalizedScale = Math.trunc(scale);

    if (normalizedScale < 0) {
      return failure(
        new PricingError("invalid_percentage", {
          details: { field: "scale" },
        })
      );
    }

    return success(new Percentage(amount, normalizedScale));
  }

  /**
   * @param amount - The rate as `amount / 10^scale` percent.
   * @param scale - The scale of the amount.
   */
  private constructor(amount: bigint, scale: number) {
    this.#amount = amount;
    this.#scale = scale;
  }

  /**
   * Returns the rate as `amount / 10^scale` percent.
   *
   * @returns The rate.
   */
  get amount(): bigint {
    return this.#amount;
  }

  /**
   * Returns the scale of the rate.
   *
   * @returns The scale.
   */
  get scale(): number {
    return this.#scale;
  }

  /**
   * Checks if this Percentage is equal to another Percentage.
   *
   * Equality is numeric (cross-multiplication), not structural: 20.0% at
   * `scale` 1 equals 20% at `scale` 0.
   *
   * @param other - The other Percentage to compare with.
   *
   * @returns True if the rates are equal, false otherwise.
   */
  equals(other: Percentage): boolean {
    const left = this.#amount * 10n ** BigInt(other.scale);
    const right = other.amount * 10n ** BigInt(this.#scale);

    return left === right;
  }

  /**
   * Returns a canonical decimal rendering of the rate followed by `%`.
   *
   * Examples: `20%`, `12.5%`, `7.25%`. Trailing zeros in the fractional part
   * are trimmed (`200` at `scale` 1 renders as `20%`). This is a stable
   * technical representation, never a localized display format.
   *
   * @returns The string representation.
   */
  toString(): string {
    const padded = this.#amount.toString().padStart(this.#scale + 1, "0");
    const point = padded.length - this.#scale;
    const integerPart = padded.slice(0, point);
    const fractionPart = padded.slice(point).replace(/0+$/, "");

    return fractionPart ? `${integerPart}.${fractionPart}%` : `${integerPart}%`;
  }
}