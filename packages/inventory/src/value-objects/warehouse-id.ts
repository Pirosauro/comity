import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * WarehouseId is a value object that represents the unique identifier of a
 * warehouse.
 *
 * Inventory is multi-warehouse native: a Stock is always scoped to one
 * warehouse. A full warehouse catalog is out of scope for `@comity/inventory`.
 */
export class WarehouseId {
  #value: string;

  /**
   * Creates a WarehouseId from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the warehouse ID.
   *
   * @returns The WarehouseId, or an `empty` error when the value is empty or
   * whitespace-only.
   */
  static create(value: string): Result<WarehouseId, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "WarehouseId" },
        })
      );
    }

    return success(new WarehouseId(value));
  }

  /**
   * @param value - The value of the warehouse ID.
   */
  private constructor(value: string) {
    this.#value = value;
  }

  /**
   * Returns the underlying string value of the warehouse ID.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this WarehouseId is equal to another WarehouseId.
   *
   * @param other - The other WarehouseId to compare with.
   *
   * @returns True if the WarehouseIds are equal, false otherwise.
   */
  equals(other: WarehouseId): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a string representation of the warehouse ID.
   *
   * @returns The string representation of the warehouse ID.
   */
  toString(): string {
    return this.#value;
  }
}