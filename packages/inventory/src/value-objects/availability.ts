import type { Result } from "@comity/primitives/result";
import type { Quantity } from "./quantity.js";

import { failure, isFailure, success } from "@comity/primitives/result";
import { InventoryError } from "../errors/inventory.js";

/**
 * Availability is a derived view of what a Stock can currently provide.
 *
 * It is computed deterministically from the stock amounts
 * (`available = onHand - reserved`) and is never persisted: it owns no state,
 * has no repository, and carries no commercial policy (preorder, backorder,
 * sellable, low stock — those belong to higher layers).
 */
export class Availability {
  #onHand: Quantity;
  #reserved: Quantity;
  #available: Quantity;

  /**
   * Creates an Availability from on-hand and reserved quantities.
   *
   * The Value Object is always created in a valid state; a reserved amount
   * exceeding the amount on hand yields an `invalid_quantity` failure instead
   * of throwing.
   *
   * @param onHand - The total physical quantity on hand.
   * @param reserved - The quantity committed to reservations.
   *
   * @returns The Availability, or an `invalid_quantity` error when the
   * reserved amount exceeds the amount on hand.
   */
  static create(onHand: Quantity, reserved: Quantity): Result<Availability, InventoryError> {
    const available = onHand.subtract(reserved);

    if (isFailure(available)) {
      return failure(
        new InventoryError("invalid_quantity", {
          details: { field: "reserved" },
        })
      );
    }

    return success(new Availability(onHand, reserved, available.value));
  }

  /**
   * @param onHand - The total physical quantity on hand.
   * @param reserved - The quantity committed to reservations.
   * @param available - The derived usable quantity.
   */
  private constructor(onHand: Quantity, reserved: Quantity, available: Quantity) {
    this.#onHand = onHand;
    this.#reserved = reserved;
    this.#available = available;
  }

  /**
   * Returns the total physical quantity on hand.
   *
   * @returns The on-hand quantity.
   */
  get onHand(): Quantity {
    return this.#onHand;
  }

  /**
   * Returns the quantity committed to reservations.
   *
   * @returns The reserved quantity.
   */
  get reserved(): Quantity {
    return this.#reserved;
  }

  /**
   * Returns the usable quantity: the amount on hand minus the reserved
   * amount.
   *
   * @returns The available quantity.
   */
  get available(): Quantity {
    return this.#available;
  }

  /**
   * Checks if this Availability is equal to another Availability.
   *
   * @param other - The other Availability to compare with.
   *
   * @returns True if all three quantities are equal, false otherwise.
   */
  equals(other: Availability): boolean {
    return (
      this.#onHand.equals(other.onHand) &&
      this.#reserved.equals(other.reserved) &&
      this.#available.equals(other.available)
    );
  }

  /**
   * Returns a stable technical serialization of the three quantities.
   *
   * This is a technical representation, NEVER a display format. Human /
   * localized rendering is the responsibility of a dedicated formatter at
   * the boundaries, out of scope for this Value Object.
   *
   * @returns The string representation.
   */
  toString(): string {
    return `${this.#available.toString()} available (${this.#onHand.toString()} on hand, ${this.#reserved.toString()} reserved)`;
  }
}