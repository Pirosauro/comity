import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { InventoryError } from "../errors/inventory.js";

/**
 * Normalized values of two quantities on a common scale.
 */
interface NormalizedQuantity {
  /** The left value on the common scale. */
  readonly left: bigint;

  /** The right value on the common scale. */
  readonly right: bigint;

  /** The common scale. */
  readonly scale: number;
}

/**
 * Quantity is a value object representing a non-negative amount of stock.
 *
 * The amount is an integer count of `scale` fractional digits: `value` 2500
 * with `scale` 3 represents 2.500 units, `value` 2500 with `scale` 0
 * represents 2500 units. Integer `bigint` arithmetic keeps the math exact —
 * no floating-point `number` is used. Fractional quantities (kg, meters, …)
 * are supported through the `scale`; each Stock keeps its own scale.
 */
export class Quantity {
  #value: bigint;
  #scale: number;

  /**
   * Creates a Quantity from an integer count and a scale.
   *
   * The Value Object is always created in a valid state; a negative value or
   * an invalid scale yields an `invalid_quantity` failure instead of throwing.
   *
   * @param value - The integer count of scale digits.
   * @param scale - The number of fractional digits represented by one unit.
   *
   * @returns The Quantity, or an `invalid_quantity` error when the value is
   * negative or the scale is not a non-negative integer.
   */
  static create(value: bigint, scale: number): Result<Quantity, InventoryError> {
    if (value < 0n) {
      return failure(
        new InventoryError("invalid_quantity", {
          details: { field: "value" },
        })
      );
    }

    if (scale < 0 || !Number.isInteger(scale)) {
      return failure(
        new InventoryError("invalid_quantity", {
          details: { field: "scale" },
        })
      );
    }

    return success(new Quantity(value, scale));
  }

  /**
   * @param value - The integer count of scale digits.
   * @param scale - The number of fractional digits represented by one unit.
   */
  private constructor(value: bigint, scale: number) {
    this.#value = value;
    this.#scale = scale;
  }

  /**
   * Returns the integer count of scale digits.
   *
   * @returns The value.
   */
  get value(): bigint {
    return this.#value;
  }

  /**
   * Returns the number of fractional digits represented by one unit.
   *
   * @returns The scale.
   */
  get scale(): number {
    return this.#scale;
  }

  /**
   * Checks if this Quantity is equal to another Quantity.
   *
   * Two quantities are equal when they represent the same amount, regardless
   * of their scale (2.5 and 25 scale 1 are equal).
   *
   * @param other - The other Quantity to compare with.
   *
   * @returns True if the quantities are equal, false otherwise.
   */
  equals(other: Quantity): boolean {
    return this.compare(other) === 0;
  }

  /**
   * Adds another Quantity to this Quantity.
   *
   * The sum cannot be negative, so this operation cannot fail.
   *
   * @param other - The Quantity to add.
   *
   * @returns The sum, normalized to the largest of the two scales.
   */
  add(other: Quantity): Quantity {
    const { left, right, scale } = this.#normalize(other);

    return new Quantity(left + right, scale);
  }

  /**
   * Subtracts another Quantity from this Quantity.
   *
   * @param other - The Quantity to subtract.
   *
   * @returns The difference, normalized to the largest of the two scales, or
   * an `invalid_quantity` error when the result would be negative.
   */
  subtract(other: Quantity): Result<Quantity, InventoryError> {
    const { left, right, scale } = this.#normalize(other);
    const result = left - right;

    if (result < 0n) {
      return failure(
        new InventoryError("invalid_quantity", {
          details: { field: "value" },
        })
      );
    }

    return success(new Quantity(result, scale));
  }

  /**
   * Compares this Quantity to another Quantity.
   *
   * @param other - The other Quantity to compare with.
   *
   * @returns -1 if this Quantity is smaller, 0 if equal, 1 if larger.
   */
  compare(other: Quantity): number {
    const { left, right } = this.#normalize(other);

    if (left < right) {
      return -1;
    }

    if (left > right) {
      return 1;
    }

    return 0;
  }

  /**
   * Returns a stable technical serialization: the integer count followed by
   * the scale (e.g. `2500 scale 3`).
   *
   * This is a technical representation, NEVER a display format. Human /
   * localized rendering (`2.5 kg`) is the responsibility of a dedicated
   * formatter at the boundaries, out of scope for this Value Object.
   *
   * @returns The string representation.
   */
  toString(): string {
    return `${this.#value.toString()} scale ${this.#scale}`;
  }

  /**
   * Normalizes two quantities to a common scale so arithmetic is exact.
   *
   * @param other - The other quantity to normalize with.
   *
   * @returns Both values on the largest of the two scales, and that scale.
   */
  #normalize(other: Quantity): NormalizedQuantity {
    const scale = Math.max(this.#scale, other.scale);

    return {
      left: this.#value * 10n ** BigInt(scale - this.#scale),
      right: other.value * 10n ** BigInt(scale - other.scale),
      scale,
    };
  }
}