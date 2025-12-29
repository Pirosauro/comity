import type { AnyMongoAbility } from "@casl/ability";
import type { RoleRepository } from "../../repositories/role.js";
import type { CreateRoleInput } from "../../validation/role.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { createRoleInputSchema } from "../../validation/role.js";

/**
 * Creates a new role after validating input data and permission.
 * @param data - Role creation input
 * @param repository - Role repository instance
 * @param ability - CASL ability instance
 * @returns Promise<void>
 * @throws ForbiddenError if permission is denied
 * @throws ZodError if input is invalid
 *
 * @example
 * await createRole({ name: "admin", description: "Administrator role" }, roleRepo, ability);
 */
export async function createRole(
  data: CreateRoleInput,
  repository: RoleRepository,
  ability: AnyMongoAbility
): Promise<void> {
  // Validate input data against schema
  data = createRoleInputSchema.parse(data);

  // Check if the ability has permission to create roles
  if (!ability.can("create", subject("Role", data))) {
    throw new ForbiddenError(
      `You do not have permission to create role '${data.name}'. Required permission: create Role.`
    );
  }

  // Create the role in the database with validated data
  await repository.create(data);
}
