import type { Result } from "@comity/primitives/result";

import { failure, success } from "@comity/primitives/result";
import { InvalidIdentifierError } from "@comity/primitives/errors";

/**
 * AuthSessionId is a value object that represents the unique identifier of an
 * authenticated session.
 *
 * @remarks
 * Comity owns the lifecycle of an authenticated session: it generates the id,
 * persists the session, and revokes it. The identifier is therefore a
 * Comity-owned Value Object, consistent with `CustomerId`, `AddressId`,
 * and `UserId`.
 *
 * `IdentityId`, in contrast, remains a primitive string because the principal
 * identity it references is owned by `@comity/identity.User` and only
 * projected into the auth context.
 */
export class AuthSessionId {
  #value: string;

  /**
   * Creates an AuthSessionId from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the auth session ID.
   *
   * @returns The AuthSessionId, or an `empty` error when the value is empty
   * or whitespace-only.
   */
  static create(value: string): Result<AuthSessionId, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "AuthSessionId" },
        })
      );
    }

    return success(new AuthSessionId(value));
  }

  /**
   * @param value - The value of the auth session ID.
   */
  private constructor(value: string) {
    this.#value = value;
  }

  /**
   * Returns the underlying string value of the auth session ID.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this AuthSessionId is equal to another AuthSessionId.
   *
   * @param other - The other AuthSessionId to compare with.
   *
   * @returns True if the AuthSessionIds are equal, false otherwise.
   */
  equals(other: AuthSessionId): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a string representation of the auth session ID.
   *
   * @returns The string representation of the auth session ID.
   */
  toString(): string {
    return this.#value;
  }
}
