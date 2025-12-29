import type { AnyMongoAbility } from "@casl/ability";
import type {
  RoleRepository,
  RoleRepositoryOptions,
  RoleResultColumns,
} from "../../repositories/role.js";
import type { RoleId } from "../../validation/role.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { roleColumnsSchema, roleIdSchema } from "../../validation/role.js";

/**
 * Reads a role by its ID.
 *
 * @param id - Role ID
 * @param repository - Role repository instance
 * @param ability - CASL ability object for permissions
 * @param options - Optional config (columns)
 * @returns Promise resolving to role data object
 * @throws {NotFoundError} If role is not found
 * @throws {ForbiddenError} If role is not authorized
 */
export const readRoleById = async (
  id: RoleId,
  repository: RoleRepository,
  ability: AnyMongoAbility,
  options: Pick<RoleRepositoryOptions, "columns"> = {}
): Promise<Partial<RoleResultColumns>> => {
  const parsedId = roleIdSchema.parse(id);

  // Set default columns if none specified
  options.columns = roleColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "Role", c));

  // Fetch the role by ID
  const [role] = (await repository.read(parsedId, options.columns)) ?? [];

  // Check if the role was found
  if (!role) {
    throw new NotFoundError(`Role with id '${parsedId}' not found.`);
  }

  // Check if the ability has permission to read the role
  if (!ability.can("read", subject("Role", role))) {
    throw new ForbiddenError(
      `You do not have permission to read role '${role.id}'. Required permission: read Role.`
    );
  }

  // Return the role data
  return role;
};
