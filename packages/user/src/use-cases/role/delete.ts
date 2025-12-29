import type { AnyMongoAbility } from "@casl/ability";
import type { RoleRepository } from "../../repositories/role.js";
import type { RoleId } from "../../validation/role.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { deleteRoleInputSchema } from "../../validation/role.js";

/**
 * Deletes a role after validating input ID.
 * @param id - Role ID
 * @param repository - Role repository instance
 * @param ability - CASL ability instance
 * @returns Promise<void>
 * @throws NotFoundError if role is not found
 * @throws ForbiddenError if permission is denied
 * @throws ZodError if input is invalid
 *
 * @example
 * await deleteRole("role-id", roleRepo, ability);
 */
export async function deleteRole(
  id: RoleId,
  repository: RoleRepository,
  ability: AnyMongoAbility
): Promise<void> {
  // Validate input
  deleteRoleInputSchema.parse({ id });

  // Fetch role for permission check
  const [role] =
    (await repository.read(id, [
      "id",
      "channelId",
      "name",
      "createdAt",
      "updatedAt",
    ])) ?? [];

  if (!role) {
    throw new NotFoundError(`Role with id '${id}' not found.`);
  }

  // Check delete permission
  if (!ability.can("delete", subject("Role", role))) {
    throw new ForbiddenError(
      `You do not have permission to delete role '${id}'. Required permission: delete Role.`
    );
  }

  await repository.delete(id);
}
