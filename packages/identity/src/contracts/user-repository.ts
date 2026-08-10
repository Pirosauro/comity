import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { User } from "../entities/user.js";
import type { UserId } from "../value-objects/user-id.js";
import type { UserStatus } from "./user.js";

/**
 * Minimal search criteria for users.
 */
export interface UserSearchCriteria {
  /** Free-text query string matched against user profile fields. */
  readonly query?: string | undefined;

  /** Filter users by lifecycle status. */
  readonly status?: UserStatus | undefined;

  /** Maximum number of results to return. */
  readonly limit?: number | undefined;

  /** Offset for paginated results. */
  readonly offset?: number | undefined;
}

/**
 * Paginated result of a user search.
 */
export interface UserSearchResult {
  /** The matching users. */
  readonly items: ReadonlyArray<User>;

  /** Total number of matching users. */
  readonly total: number;
}

/**
 * User repository is responsible for managing user persistence.
 */
export interface UserRepository {
  /** Retrieves a user by its ID */
  getById(id: UserId): Promise<Result<User | null, RepositoryError>>;

  /** Searches users matching the given criteria */
  search(
    criteria?: UserSearchCriteria
  ): Promise<Result<UserSearchResult, RepositoryError>>;

  /** Saves a user */
  save(user: User): Promise<Result<void, RepositoryError>>;

  /** Removes a user from the persistence layer */
  remove(id: UserId): Promise<Result<void, RepositoryError>>;
}