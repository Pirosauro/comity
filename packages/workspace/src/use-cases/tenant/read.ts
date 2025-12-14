import type { AnyMongoAbility } from "@casl/ability";
import type { TenantId } from "../../validation/tenant.js";
import type {
  TenantRepository,
  TenantRepositoryOptions,
} from "../../repositories/tenant.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { tenantColumnsSchema } from "../../validation/tenant.js";

/**
 * Read a tenant by ID
 *
 * This use case validates the user's permission to read the tenant,
 * then retrieves the tenant from the database.
 *
 * @param id - The tenant ID to read
 * @param repository - The tenant repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to read the tenant
 * @throws {NotFoundError} If the tenant is not found
 * @returns The tenant record
 */
export const readTenant = async (
  id: TenantId,
  repository: TenantRepository,
  ability: AnyMongoAbility,
  options: {
    columns?: TenantRepositoryOptions["columns"];
  } = {}
): Promise<Record<string, unknown>> => {
  // Validate and pre-filter requested columns based on field-level permissions
  options.columns = tenantColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "Tenant", c));

  // Retrieve the tenant
  const [tenant] = (await repository.read(id, options.columns)) ?? [];

  if (!tenant) {
    throw new NotFoundError("Tenant not found");
  }

  // Check permission to read the tenant
  if (!ability.can("read", subject("Tenant", tenant))) {
    throw new ForbiddenError("You are not allowed to read this tenant");
  }

  return tenant;
};
