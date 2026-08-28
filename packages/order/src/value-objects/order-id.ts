import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * OrderId is a value object that represents the unique identifier of an order.
 *
 * @remarks
 * OrderId is globally unique. The current implementation generates UUIDs.
 * The repository uses a composite key of `TenantId + OrderId` as its physical
 * storage namespace, but the OrderId itself is globally unique and not scoped
 * to a tenant.
 */
export class OrderId {
  #value: string;

  /**
   * Creates an OrderId from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the order ID.
   *
   * @returns The OrderId, or an `empty` error when the value is empty or
   * whitespace-only.
   */
  static create(value: string): Result<OrderId, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "OrderId" },
        })
      );
    }

    return success(new OrderId(value));
  }

  /**
   * @param value - The value of the order ID.
   */
  private constructor(value: string) {
    this.#value = value;
  }

  /**
   * Returns the underlying string value of the order ID.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this OrderId is equal to another OrderId.
   *
   * @param other - The other OrderId to compare with.
   *
   * @returns True if the OrderIds are equal, false otherwise.
   */
  equals(other: OrderId): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a string representation of the order ID.
   *
   * @returns The string representation of the order ID.
   */
  toString(): string {
    return this.#value;
  }
}
