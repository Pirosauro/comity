import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * CustomerId is a value object that represents the unique identifier of a customer.
 */
export class CustomerId {
  #value: string;

  /**
   * Creates a CustomerId from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the customer ID.
   *
   * @returns The CustomerId, or an `empty` error when the value is empty or
   * whitespace-only.
   */
  static create(value: string): Result<CustomerId, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "CustomerId" },
        })
      );
    }

    return success(new CustomerId(value));
  }

  /**
   * @param value - The value of the customer ID.
   */
  private constructor(value: string) {
    this.#value = value;
  }

  /**
   * Returns the underlying string value of the customer ID.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this CustomerId is equal to another CustomerId.
   *
   * @param other - The other CustomerId to compare with.
   *
   * @returns True if the CustomerIds are equal, false otherwise.
   */
  equals(other: CustomerId): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a string representation of the customer ID.
   *
   * @returns The string representation of the customer ID.
   */
  toString(): string {
    return this.#value;
  }
}
