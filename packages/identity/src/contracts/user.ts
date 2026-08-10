import type { Instant } from "@comity/primitives/time";
import type { UserId } from "../value-objects/user-id.js";

/**
 * User lifecycle status.
 */
export type UserStatus = "active" | "inactive" | "revoked";

/**
 * User identity and profile data.
 */
export interface UserData {
  /** The user's display name, if provided. */
  readonly displayName: string | null;

  /** The user's given name, if provided. */
  readonly givenName: string | null;

  /** The user's family name, if provided. */
  readonly familyName: string | null;
}

/**
 * A user's persistent state including their unique identifier and lifecycle status.
 */
export interface UserState extends UserData {
  /** The unique identifier of the user. */
  readonly id: UserId;

  /** The timestamp when the user was created. */
  readonly createdAt: Instant;

  /** The timestamp when the user was last updated. */
  readonly updatedAt: Instant;

  /** The lifecycle status of the user. */
  readonly status: UserStatus;
}

/**
 * Immutable point-in-time snapshot of an existing user.
 */
export type UserSnapshot = Readonly<
  UserState & {
    /** The timestamp when the snapshot was captured. */
    readonly capturedAt: Instant;
  }
>;

/**
 * Data required to create a new user.
 *
 * @remark
 * Persisted lifecycle metadata (`createdAt`, `updatedAt`, `status`) may be
 * supplied when hydrating from persistence. When omitted, the entity
 * initializes them at construction time. The default `status` for newly
 * created users is `"inactive"`; hydrating from persistence with a
 * different `status` preserves the persisted value.
 */
export type UserCreate = UserData & {
  /** The timestamp when the user was created. */
  readonly createdAt?: Instant;

  /** The timestamp when the user was last updated. */
  readonly updatedAt?: Instant;

  /** The lifecycle status of the user. */
  readonly status?: UserStatus;
};

/**
 * Partial update data for a user.
 */
export type UserUpdate = Partial<UserState>;
