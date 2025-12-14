import type { AnyMongoAbility } from "@casl/ability";
import type { UpdateTenantInput } from "../../validation/tenant.js";
import type { TenantRepository } from "../../repositories/tenant.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

/**
 * Update a tenant
 *
 * This use case validates the user's permission to update the tenant,
 * then applies the updates to the database.
 *
 * @param data - The update data including tenant ID and fields to update
 * @param repository - The tenant repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to update the tenant
 * @throws {NotFoundError} If the tenant is not found
 * @returns The updated tenant record
 */
export const updateTenant = async (
  data: UpdateTenantInput,
  repository: TenantRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  const { id, ...args } = data;

  // Retrieve the tenant
  const [tenant] = (await repository.read(id)) ?? [];

  if (!tenant) {
    throw new NotFoundError("Tenant not found");
  }

  // Check permission to update the tenant
  if (!ability.can("update", subject("Tenant", tenant))) {
    throw new ForbiddenError("You are not allowed to update this tenant");
  }

  // Update the tenant
  await repository.update(id, args);
};
