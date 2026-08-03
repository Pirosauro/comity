/**
 * AddressLine is a value object that represents a single line of an address.
 */
export class AddressLine {
  #value: string;

  /**
   * @param value - The value of the address line.
   */
  constructor(value: string) {
    this.#value = value;
  }

  /**
   * Checks if this address line is equal to another address line.
   *
   * @param other - The other address line to compare with.
   *
   * @returns True if the address lines are equal, false otherwise.
   */
  equals(other: AddressLine): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a string representation of the address line.
   *
   * @returns The string representation of the address line.
   */
  toString(): string {
    return this.#value;
  }
}
