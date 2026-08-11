import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * CustomerId is a value object that represents the unique identifier of a customer.
 */
export class CustomerId {
  #value: string;

  /**
   * @param value - The value of the customer ID.
   *
   * @throws {InvalidIdentifierError} when the value is empty or whitespace-only.
   */
  constructor(value: string) {
    if (value.trim().length === 0) {
      throw new InvalidIdentifierError("empty", {
        details: { kind: "CustomerId" },
      });
    }

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
