import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * AddressId is a value object that represents the unique identifier of an address.
 */
export class AddressId {
  #value: string;

  /**
   * @param value - The value of the address ID.
   *
   * @throws {InvalidIdentifierError} when the value is empty or whitespace-only.
   */
  constructor(value: string) {
    if (value.trim().length === 0) {
      throw new InvalidIdentifierError("empty", {
        details: { kind: "AddressId" },
      });
    }

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
