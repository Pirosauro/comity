import type { AnyMongoAbility } from "@casl/ability";
import type { UserRoleRepository } from "../../repositories/user-role.js";
import type { CreateUserRoleInput } from "../../validation/user-role.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { createUserRoleInputSchema } from "../../validation/user-role.js";

/**
 * Creates a new user-role assignment after validating input data and permission.
 *
 * @param data - UserRole creation input, validated against Zod schema
 * @param repository - UserRoleRepository instance for database operations
 * @param ability - CASL ability instance for permission validation
 *
 * @returns Promise<void>
 *
 * @throws ZodError if input data is invalid
 * @throws ForbiddenError if the ability does not have permission to create the user-role assignment
 *
 * @remarks
 * - Validates input using Zod schema.
 * - Checks CASL permission for "create" action on UserRole.
 * - Throws ForbiddenError if permission is denied.
 *
 * @example
 * await createUserRole({ userId: "user-id", roleId: "role-id" }, userRoleRepo, ability);
 */
export async function createUserRole(
  data: CreateUserRoleInput,
  repository: UserRoleRepository,
  ability: AnyMongoAbility
): Promise<void> {
  // Validate input data against schema
  data = createUserRoleInputSchema.parse(data);

  // Check if the ability has permission to create user-role assignments
  if (!ability.can("create", subject("UserRole", data))) {
    throw new ForbiddenError(
      `You do not have permission to assign role '${data.roleId}' to user '${data.userId}'. Required permission: create UserRole.`
    );
  }

  // Create the user-role assignment in the database with validated data
  await repository.create(data);
}
