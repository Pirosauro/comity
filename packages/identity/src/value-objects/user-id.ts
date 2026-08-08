/**
 * UserId is a value object that represents the unique identifier of a user.
 */
export class UserId {
  #value: string;

  /**
   * @param value - The value of the user ID.
   */
  constructor(value: string) {
    this.#value = value;
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