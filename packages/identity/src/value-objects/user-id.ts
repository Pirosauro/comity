import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * UserId is a value object that represents the unique identifier of a user.
 */
export class UserId {
  #value: string;

  /**
   * @param value - The value of the user ID.
   *
   * @throws {InvalidIdentifierError} when the value is empty or whitespace-only.
   */
  constructor(value: string) {
    if (value.trim().length === 0) {
      throw new InvalidIdentifierError("empty", {
        details: { kind: "UserId" },
      });
    }

    this.#value = value;
  }

  /**
   * Returns the underlying string value of the user ID.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this UserId is equal to another UserId.
   *
   * @param other - The other UserId to compare with.
   *
   * @returns True if the UserIds are equal, false otherwise.
   */
  equals(other: UserId): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a string representation of the user ID.
   *
   * @returns The string representation of the user ID.
   */
  toString(): string {
    return this.#value;
  }
}
