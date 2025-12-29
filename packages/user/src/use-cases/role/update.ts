import type { AnyMongoAbility } from "@casl/ability";
import type { RoleRepository } from "../../repositories/role.js";
import type { UpdateRoleInput } from "../../validation/role.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { updateRoleInputSchema } from "../../validation/role.js";

/**
 * Updates a role after validating input data and permission.
 * @param data - Role update input
 * @param repository - Role repository instance
 * @param ability - CASL ability instance
 * @param options - Optional config:
 *   - softFail?: If true, silently skips fields without permission instead of throwing (default: false)
 *
 * @returns Promise<void>
 *
 * @throws ZodError if input data is invalid
 * @throws NotFoundError if the role does not exist
 * @throws ForbiddenError if the ability does not have permission to update the role or specific fields
 *
 * @remarks
 * - Validates input using Zod schema.
 * - Checks CASL permission for "update" action on Role and for each field.
 * - Throws ForbiddenError if permission is denied for the role or any field (unless softFail is true).
 *
 * @example
 * await updateRole(
 *   { id: "role-id", name: "Editor" },
 *   roleRepo,
 *   ability,
 *   { softFail: false }
 * );
 */
export async function updateRole(
  data: UpdateRoleInput,
  repository: RoleRepository,
  ability: AnyMongoAbility,
  options: {
    softFail?: boolean;
  } = {}
): Promise<void> {
  // Validate input data
  const { id, ...args } = updateRoleInputSchema.parse(data);

  const [role] =
    (await repository.read(id, [
      "id",
      "channelId",
      "name",
      "createdAt",
      "updatedAt",
    ])) ?? [];

  // Check if the role was found
  if (!role) {
    throw new NotFoundError(`Role with id '${id}' not found.`);
  }

  // Check if the actor has permission to update this role
  if (!ability.can("update", subject("Role", role))) {
    throw new ForbiddenError(
      `You do not have permission to update role '${id}'. Required permission: update Role.`
    );
  }

  // Check field-level permissions for each field being updated
  const blacklist = Object.keys(args).filter(
    (field) => !ability.can("update", subject("Role", role), field)
  );

  if (!options.softFail && blacklist.length > 0) {
    throw new ForbiddenError(
      `You do not have permission to update fields: ${blacklist.join(
        ", "
      )} on role '${id}'. Check your role's field-level permissions.`
    );
  }

  // Perform the update with validated data
  await repository.update(
    id,
    Object.fromEntries(
      Object.entries(args).filter(([field]) => !blacklist.includes(field))
    )
  );
}
