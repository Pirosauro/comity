import type { AnyMongoAbility } from "@casl/ability";
import type { UserRepository } from "../../repositories/user.js";
import type { CreateUserInput } from "../../validation/user.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { createUserInputSchema } from "../../validation/user.js";

/**
 * Creates a new user after validating input data and permission.
 * @param data - User creation input
 * @param repository - User repository instance
 * @param ability - CASL ability instance
 */
export async function createUser(
  data: CreateUserInput,
  repository: UserRepository,
  ability: AnyMongoAbility
): Promise<void> {
  // Validate input data against schema
  data = createUserInputSchema.parse(data);

  // Check if the ability has permission to create users
  if (!ability.can("create", subject("User", data))) {
    throw new ForbiddenError(
      `You do not have permission to create user with identifier '${data.identifier}'. Required permission: create User.`
    );
  }

  // Create the user in the database with validated data
  await repository.create(data);
}
