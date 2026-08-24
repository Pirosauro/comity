import type { Result } from "@comity/primitives/result";

import { success } from "@comity/primitives/result";

/**
 * AddressLine is a value object that represents a single line of an address.
 */
export class AddressLine {
  #value: string;

  /**
   * Creates an AddressLine from a string.
   *
   * Address lines carry no validation: any string is a valid line. The
   * factory keeps creation consistent with the Comity Value Object pattern
   * (the `never` error type signals that creation cannot fail).
   *
   * @param value - The value of the address line.
   *
   * @returns The AddressLine.
   */
  static create(value: string): Result<AddressLine, never> {
    return success(new AddressLine(value));
  }

  /**
   * @param value - The value of the address line.
   */
  private constructor(value: string) {
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
