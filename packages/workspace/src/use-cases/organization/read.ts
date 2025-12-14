import type { AnyMongoAbility } from "@casl/ability";
import type {
  OrganizationId,
  OrganizationColumns,
  OrganizationCode,
} from "../../validation/organization.js";
import type { TenantId } from "../../validation/tenant.js";
import type {
  OrganizationRepository,
  OrganizationResultColumns,
} from "../../repositories/organization.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import {
  organizationCodeSchema,
  organizationColumnsSchema,
  organizationIdSchema,
} from "../../validation/organization.js";

export async function readOrganization(
  id: OrganizationId,
  repository: OrganizationRepository,
  ability: AnyMongoAbility,
  options: { columns?: OrganizationColumns } = {}
): Promise<Partial<OrganizationResultColumns>> {
  // Validate organization ID
  id = organizationIdSchema.parse(id);

  // Validate and pre-filter requested columns based on field-level permissions
  options.columns = organizationColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "Organization", c));

  const [organization] = (await repository.read(id, options.columns)) ?? [];

  // Check if the organization was found
  if (!organization) {
    throw new NotFoundError(`Organization with id '${id}' not found.`);
  }

  // Check if the actor has permission to read this organization
  if (!ability.can("read", subject("Organization", organization))) {
    throw new ForbiddenError(
      `You do not have permission to read organization '${id}'. Required permission: read Organization.`
    );
  }

  return organization;
}

export async function readOrganizationByCode(
  code: OrganizationCode,
  tenantId: TenantId,
  repository: OrganizationRepository,
  ability: AnyMongoAbility,
  options: { columns?: OrganizationColumns } = {}
): Promise<Partial<OrganizationResultColumns>> {
  if (!tenantId) {
    throw new Error("Tenant ID is required to read organization by code.");
  }

  if (!ability.can("read", subject("Tenant", { id: tenantId }))) {
    throw new ForbiddenError(
      `You do not have permission to read tenant with id '${tenantId}'. Required permission: read Tenant.`
    );
  }

  // Validate organization code
  code = organizationCodeSchema.parse(code);

  // Validate and pre-filter requested columns based on field-level permissions
  options.columns = organizationColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "Organization", c));

  const [organization] =
    (await repository.readByCode(code, tenantId, options.columns)) ?? [];

  // Check if the organization was found
  if (!organization) {
    throw new NotFoundError(`Organization with code '${code}' not found.`);
  }

  // Check if the actor has permission to read this organization
  if (!ability.can("read", subject("Organization", organization))) {
    throw new ForbiddenError(
      `You do not have permission to read organization '${organization.id}'. Required permission: read Organization.`
    );
  }

  return organization as Partial<OrganizationResultColumns>;
}
