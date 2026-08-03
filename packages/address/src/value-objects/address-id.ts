/**
 * AddressId is a value object that represents the unique identifier of an address.
 */
export class AddressId {
  #value: string;

  /**
   * @param value - The value of the address ID.
   */
  constructor(value: string) {
    this.#value = value;
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
