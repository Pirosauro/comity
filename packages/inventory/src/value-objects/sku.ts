import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * Sku is a value object that represents the stock-keeping unit of a product.
 *
 * The identifier is owned by `@comity/inventory`; `@comity/catalog` keeps a
 * loose string reference and MUST NOT model stock.
 */
export class Sku {
  #value: string;

  /**
   * Creates a Sku from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the SKU.
   *
   * @returns The Sku, or an `empty` error when the value is empty or
   * whitespace-only.
   */
  static create(value: string): Result<Sku, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "Sku" },
        })
      );
    }

    return success(new Sku(value));
  }

  /**
   * @param value - The value of the SKU.
   */
  private constructor(value: string) {
    this.#value = value;
  }

  /**
   * Returns the underlying string value of the SKU.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this Sku is equal to another Sku.
   *
   * @param other - The other Sku to compare with.
   *
   * @returns True if the Skus are equal, false otherwise.
   */
  equals(other: Sku): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a string representation of the SKU.
   *
   * @returns The string representation of the SKU.
   */
  toString(): string {
    return this.#value;
  }
}