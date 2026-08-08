/**
 * CustomerId is a value object that represents the unique identifier of a customer.
 */
export class CustomerId {
  #value: string;

  /**
   * @param value - The value of the customer ID.
   */
  constructor(value: string) {
    this.#value = value;
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