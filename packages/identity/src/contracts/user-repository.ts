import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { User } from "../entities/user.js";
import type { UserId } from "../value-objects/user-id.js";

/**
 * User repository is responsible for managing user persistence.
 */
export interface UserRepository {
  /** Retrieves a user by its ID */
  getById(id: UserId): Promise<Result<User | null, RepositoryError>>;

  /** Saves a user */
  save(user: User): Promise<Result<void, RepositoryError>>;
}