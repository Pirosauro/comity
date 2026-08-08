import type { UserCreate, UserSnapshot, UserStatus, UserUpdate } from "../contracts/user.js";
import type { UserId } from "../value-objects/user-id.js";

import { Instant } from "@comity/primitives/time";

/**
 * Represents a user entity in the identity domain.
 */
export class User {
  #id: UserId | undefined;
  #displayName: string | null;
  #givenName: string | null;
  #familyName: string | null;
  #status: UserStatus;
  readonly #createdAt: Instant;

  /**
   * @param fields - The fields used to create the user.
   * @param id - The unique identifier of the user, if it has been assigned.
   */
  constructor(fields: UserCreate, id?: UserId) {
    this.#id = id;
    this.#displayName = fields.displayName;
    this.#givenName = fields.givenName;
    this.#familyName = fields.familyName;
    this.#status = "active";
    this.#createdAt = Instant.now();
  }

  /**
   * @returns The unique identifier of the user, if it has been assigned.
   */
  get id(): UserId | undefined {
    return this.#id;
  }

  /**
   * @returns The display name of the user.
   */
  get displayName(): string | null {
    return this.#displayName;
  }

  /**
   * @returns The given name of the user, if provided.
   */
  get givenName(): string | null {
    return this.#givenName;
  }

  /**
   * @returns The family name of the user, if provided.
   */
  get familyName(): string | null {
    return this.#familyName;
  }

  /**
   * @returns The lifecycle status of the user.
   */
  get status(): UserStatus {
    return this.#status;
  }

  /**
   * @returns The timestamp when the user was created.
   */
  get createdAt(): Instant {
    return this.#createdAt;
  }

  /**
   * Updates the user with the provided changes.
   *
   * @param changes - The partial changes to apply to the user.
   */
  update(changes: UserUpdate): void {
    if (changes.displayName !== undefined) {
      this.#displayName = changes.displayName;
    }

    if (changes.givenName !== undefined) {
      this.#givenName = changes.givenName;
    }

    if (changes.familyName !== undefined) {
      this.#familyName = changes.familyName;
    }
  }

  /**
   * Creates a snapshot of the current state of the user.
   * Requires the user to have an assigned identifier.
   *
   * @returns A snapshot representing the current state of the user.
   */
  snapshot(): UserSnapshot {
    return {
      id: this.#id as UserId,
      displayName: this.#displayName,
      givenName: this.#givenName,
      familyName: this.#familyName,
      status: this.#status,
      capturedAt: Instant.now(),
    };
  }
}