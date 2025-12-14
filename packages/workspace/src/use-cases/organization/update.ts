import type { AnyMongoAbility } from "@casl/ability";
import type { UpdateOrganizationInput } from "../../validation/organization.js";
import type { OrganizationRepository } from "../../repositories/organization.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { organizationColumnsSchema } from "../../validation/organization.js";

/**
 * Update an organization
 *
 * This use case validates the user's permission to update the organization,
 * then applies the updates to the database.
 *
 * @param data - The update data including organization ID and fields to update
 * @param repository - The organization repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to update the organization
 * @throws {NotFoundError} If the organization is not found
 * @returns The updated organization record
 */
export const updateOrganization = async (
  data: UpdateOrganizationInput,
  repository: OrganizationRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  const { id, ...args } = data;

  // Retrieve the organization
  const [organization] = (await repository.read(id)) ?? [];

  if (!organization) {
    throw new NotFoundError("Organization not found");
  }

  // Check permission to update the organization
  if (!ability.can("update", subject("Organization", organization))) {
    throw new ForbiddenError("You are not allowed to update this organization");
  }

  // Validate and pre-filter requested columns based on field-level permissions
  const columns = organizationColumnsSchema
    .parse(args)
    .filter((c) => ability.can("update", "Organization", c));
  // Build payload only with allowed columns and update the organization
  const payload = Object.fromEntries(
    Object.entries(args).filter(([key]) =>
      columns.includes(key as (typeof columns)[number])
    )
  );

  await repository.update(id, payload);
};
