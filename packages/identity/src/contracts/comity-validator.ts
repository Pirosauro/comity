import type { Result } from "@comity/primitives/result";
import type { ValidationError } from "@comity/validation/errors";
import type { User } from "../entities/user.js";

/**
 * User validator is responsible for validating users.
 */
export interface UserValidator {
  /** Validates a user. */
  validate(user: User): Result<User, ValidationError>;
}
