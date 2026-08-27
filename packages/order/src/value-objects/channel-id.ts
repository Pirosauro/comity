import type { Result } from "@comity/primitives/result";

import { InvalidIdentifierError } from "@comity/primitives/errors";
import { failure, success } from "@comity/primitives/result";

/**
 * ChannelId is a value object that represents the unique identifier of a
 * commercial channel (e.g. "web", "mobile", "pos").
 *
 * Channel is an operation scope, a policy key, and part of the commercial
 * identity of an order. It is intentionally a typed identifier only: no
 * Channel aggregate or entity exists at the foundation level.
 */
export class ChannelId {
  #value: string;

  /**
   * Creates a ChannelId from an identifier string.
   *
   * The Value Object is always created in a valid state; an empty or
   * whitespace-only value yields an `empty` failure instead of throwing.
   *
   * @param value - The value of the channel ID.
   *
   * @returns The ChannelId, or an `empty` error when the value is empty or
   * whitespace-only.
   */
  static create(value: string): Result<ChannelId, InvalidIdentifierError> {
    if (value.trim().length === 0) {
      return failure(
        new InvalidIdentifierError("empty", {
          details: { kind: "ChannelId" },
        })
      );
    }

    return success(new ChannelId(value));
  }

  /**
   * @param value - The value of the channel ID.
   */
  private constructor(value: string) {
    this.#value = value;
  }

  /**
   * Returns the underlying string value of the channel ID.
   *
   * @returns The underlying identifier.
   */
  get value(): string {
    return this.#value;
  }

  /**
   * Checks if this ChannelId is equal to another ChannelId.
   *
   * @param other - The other ChannelId to compare with.
   *
   * @returns True if the ChannelIds are equal, false otherwise.
   */
  equals(other: ChannelId): boolean {
    return this.#value === other.toString();
  }

  /**
   * Returns a stable technical serialization of the channel ID.
   *
   * This is a technical representation, NEVER a display format.
   *
   * @returns The string representation of the channel ID.
   */
  toString(): string {
    return this.#value;
  }
}
