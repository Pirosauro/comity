import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * AddressId is a value object that represents the unique identifier of an address.
 */
export class AddressId {
  #value: string;

  /**
   * Creates an AddressId from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the address ID.
   *
   * @returns The AddressId, or an `empty` error when the value is empty or
   * whitespace-only.
   */
  static create(value: string): Result<AddressId, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "AddressId" },
        })
      );
    }

    return success(new AddressId(value));
  }

  /**
   * @param value - The value of the address ID.
   */
  private constructor(value: string) {
    this.#value = value;
  }

  /**
   * Returns the underlying string value of the address ID.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this AddressId is equal to another AddressId.
   *
   * @param other - The other AddressId to compare with.
   *
   * @returns True if the AddressIds are equal, false otherwise.
   */
  equals(other: AddressId): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a string representation of the address ID.
   *
   * @returns The string representation of the address ID.
   */
  toString(): string {
    return this.#value;
  }
}
