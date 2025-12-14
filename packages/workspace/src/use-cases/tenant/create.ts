import type { AnyMongoAbility } from "@casl/ability";
import type { CreateTenantInput } from "../../validation/tenant.js";
import type { TenantRepository } from "../../repositories/tenant.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";

/**
 * Create a new tenant
 *
 * This use case validates the user's permission to create a tenant,
 * then persists the tenant to the database.
 *
 * @param data - The tenant data to create
 * @param repository - The tenant repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to create tenants
 * @throws {Error} If the tenant creation fails
 * @returns The created tenant ID
 */
export const createTenant = async (
  data: CreateTenantInput,
  repository: TenantRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  // Check permission to create tenant
  if (!ability.can("create", subject("Tenant", data))) {
    throw new ForbiddenError("You are not allowed to create tenants");
  }

  // Create the tenant
  await repository.create(data);
};
