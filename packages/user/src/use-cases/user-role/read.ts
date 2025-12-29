import type { AnyMongoAbility } from "@casl/ability";
import type {
  UserRoleRepository,
  UserRoleRepositoryOptions,
  UserRoleResultColumns,
} from "../../repositories/user-role.js";
import type { UserId } from "../../validation/user.js";
import type { RoleId } from "../../validation/role.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import {
  userRoleColumnsSchema,
  userIdSchema,
} from "../../validation/user-role.js";
import { roleIdSchema } from "../../validation/role.js";

/**
 * Reads a user-role assignment by a specified lookup type (by userId & roleId), with validation and permission checks.
 *
 * @param type - Lookup strategy: "userRole"
 * @param identifier - The search value; [userId, roleId] tuple
 * @param repository - UserRoleRepository instance for database operations
 * @param ability - CASL ability object for permission validation
 * @param options - Optional config:
 *   - columns: Array of user-role column names to select (default: all columns)
 *
 * @returns Promise<Partial<UserRoleResultColumns>> - UserRole data object with permitted fields
 *
 * @throws BadRequest if identifier format is invalid
 * @throws NotFoundError if user-role assignment is not found
 * @throws ForbiddenError if user-role assignment is not authorized
 *
 * @remarks
 * - Field-level permissions: Only columns the ability can read are selected.
 * - Record-level permissions: Only returns user-role if the ability can read the assignment.
 * - Uses Zod schema for input validation.
 *
 * @example
 * // Read user-role by userId and roleId
 * const userRole = await readUserRoleBy("userRole", ["user-id", "role-id"], repo, ability);
 */

export const readUserRole = async (
  userId: UserId,
  roleId: RoleId,
  repository: UserRoleRepository,
  ability: AnyMongoAbility,
  options: Pick<UserRoleRepositoryOptions, "columns"> = {}
): Promise<Partial<UserRoleResultColumns>> => {
  userId = userIdSchema.parse(userId);
  roleId = roleIdSchema.parse(roleId);

  // Set default columns if none specified
  options.columns = userRoleColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "UserRole", c));

  // Fetch the user-role assignment
  const [userRole] =
    (await repository.read(userId, roleId, options.columns)) ?? [];

  // Check if the user-role assignment was found
  if (!userRole) {
    throw new NotFoundError(
      `UserRole with userId '${userId}' and roleId '${roleId}' not found.`
    );
  }

  // Check if the ability has permission to read the user-role assignment
  if (!ability.can("read", subject("UserRole", userRole))) {
    throw new ForbiddenError(
      `You do not have permission to read user-role assignment for user '${userId}' and role '${roleId}'. Required permission: read UserRole.`
    );
  }

  // Return the user-role data
  return userRole;
};
