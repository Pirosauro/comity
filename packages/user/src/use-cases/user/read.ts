import type { AnyMongoAbility } from "@casl/ability";
import type {
  UserRepository,
  UserRepositoryOptions,
  UserResultColumns,
} from "../../repositories/user.js";
import type {
  UserId,
  UserIdentifier,
  UserProvider,
} from "../../validation/user.js";
import { subject } from "@casl/ability";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "@comity/core/errors";
import {
  userColumnsSchema,
  userIdSchema,
  userIdentifierSchema,
  userProviderSchema,
} from "../../validation/user.js";

/**
 * Reads a user by a specified lookup type (id or identifier).
 *
 * @param type - Lookup strategy: "id" or "identifier"
 * @param identifier - The search value (user ID or identifier string)
 * @param repository - User repository instance
 * @param ability - CASL ability object for permissions
 * @param options - Optional config (columns)
 * @returns Promise resolving to user data object
 * @throws {NotFoundError} If user is not found
 * @throws {ForbiddenError} If user is not authorized
 */

export const readUserBy = async (
  type: "id" | "identifier",
  identifier: UserId | [UserProvider, UserIdentifier],
  repository: UserRepository,
  ability: AnyMongoAbility,
  options: Pick<UserRepositoryOptions, "columns"> = {}
): Promise<Partial<UserResultColumns>> => {
  if (type === "identifier" && !Array.isArray(identifier)) {
    throw new BadRequestError("Invalid identifier format");
  }

  const provider =
    type === "identifier" ? userProviderSchema.parse(identifier[0]) : null;
  identifier =
    type === "identifier"
      ? userIdentifierSchema.parse(identifier[1])
      : userIdSchema.parse(identifier);

  // Set default columns if none specified
  options.columns = userColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "User", c));

  // Fetch the user by ID
  const [user] =
    type === "identifier"
      ? (await repository.readByIdentifier(
          identifier,
          provider || "",
          options.columns
        )) ?? []
      : (await repository.read(identifier, options.columns)) ?? [];

  // Check if the user was found
  if (!user) {
    throw new NotFoundError(`User with ${type} '${identifier}' not found.`);
  }

  // Check if the ability has permission to read the user
  if (!ability.can("read", subject("User", user))) {
    throw new ForbiddenError(
      `You do not have permission to read user '${user.id}'. Required permission: read User.`
    );
  }

  // Return the user data
  return user;
};

/**
 * Reads a user by ID.
 */
export function readUserById(
  id: UserId,
  repository: UserRepository,
  ability: AnyMongoAbility,
  options: Pick<UserRepositoryOptions, "columns"> = {}
): Promise<Partial<UserResultColumns>> {
  return readUserBy("id", id, repository, ability, options);
}

/**
 * Reads a user by identifier (e.g., email or username).
 */
export function readUserByIdentifier(
  identifier: [UserProvider, UserIdentifier],
  repository: UserRepository,
  ability: AnyMongoAbility,
  options: Pick<UserRepositoryOptions, "columns"> = {}
): Promise<Partial<UserResultColumns>> {
  return readUserBy("identifier", identifier, repository, ability, options);
}
