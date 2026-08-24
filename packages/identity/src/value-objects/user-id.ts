import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * UserId is a value object that represents the unique identifier of a user.
 */
export class UserId {
  #value: string;

  /**
   * Creates a UserId from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the user ID.
   *
   * @returns The UserId, or an `empty` error when the value is empty or
   * whitespace-only.
   */
  static create(value: string): Result<UserId, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "UserId" },
        })
      );
    }

    return success(new UserId(value));
  }

  /**
   * @param value - The value of the user ID.
   */
  private constructor(value: string) {
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
