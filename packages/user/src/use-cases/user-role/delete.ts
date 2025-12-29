import type { AnyMongoAbility } from "@casl/ability";
import type { UserRoleRepository } from "../../repositories/user-role.js";
import type { DeleteUserRoleInput } from "../../validation/user-role.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { deleteUserRoleInputSchema } from "../../validation/user-role.js";

/**
 * Deletes a user-role assignment after validating input and permission.
 *
 * @param input - Object containing userId and roleId, validated against Zod schema
 * @param repository - UserRoleRepository instance for database operations
 * @param ability - CASL ability instance for permission validation
 *
 * @returns Promise<void>
 *
 * @throws ZodError if input is invalid
 * @throws NotFoundError if the user-role assignment does not exist
 * @throws ForbiddenError if the ability does not have permission to delete the user-role assignment
 *
 * @remarks
 * - Validates input using Zod schema.
 * - Checks CASL permission for "delete" action on UserRole.
 * - Throws NotFoundError if the assignment does not exist.
 * - Throws ForbiddenError if permission is denied.
 *
 * @example
 * await deleteUserRole({ userId: "user-id", roleId: "role-id" }, userRoleRepo, ability);
 */
export async function deleteUserRole(
  input: DeleteUserRoleInput,
  repository: UserRoleRepository,
  ability: AnyMongoAbility
): Promise<void> {
  // Validate input
  const { userId, roleId } = deleteUserRoleInputSchema.parse(input);

  // Fetch user-role for permission check
  const [userRole] =
    (await repository.read(userId, roleId, ["userId", "roleId"])) ?? [];

  if (!userRole) {
    throw new NotFoundError(
      `UserRole with userId '${userId}' and roleId '${roleId}' not found.`
    );
  }

  // Check delete permission
  if (!ability.can("delete", subject("UserRole", userRole))) {
    throw new ForbiddenError(
      `You do not have permission to delete user-role assignment for user '${userId}' and role '${roleId}'. Required permission: delete UserRole.`
    );
  }

  await repository.delete(userId, roleId);
}
