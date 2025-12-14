import type { AnyMongoAbility } from "@casl/ability";
import type { DeleteTenantInput } from "../../validation/tenant.js";
import type { TenantRepository } from "../../repositories/tenant.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

/**
 * Delete a tenant (soft delete)
 *
 * This use case validates the user's permission to delete the tenant,
 * then performs a soft delete by setting the deletedAt timestamp.
 *
 * @param data - The deletion data including tenant ID
 * @param repository - The tenant repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to delete the tenant
 * @throws {NotFoundError} If the tenant is not found
 */
export const deleteTenant = async (
  data: DeleteTenantInput,
  repository: TenantRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  const { id } = data;

  // Retrieve the tenant
  const [tenant] = (await repository.read(id)) ?? [];

  if (!tenant) {
    throw new NotFoundError("Tenant not found");
  }

  // Check permission to delete the tenant
  if (!ability.can("delete", subject("Tenant", tenant))) {
    throw new ForbiddenError("You are not allowed to delete this tenant");
  }

  // Delete the tenant
  await repository.delete(id);
};
