import type { AnyMongoAbility } from "@casl/ability";
import type { DeleteOrganizationInput } from "../../validation/organization.js";
import type { OrganizationRepository } from "../../repositories/organization.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

/**
 * Delete an organization (soft delete)
 *
 * This use case validates the user's permission to delete the organization,
 * then performs a soft delete by setting the deletedAt timestamp.
 *
 * @param data - The deletion data including organization ID
 * @param repository - The organization repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to delete the organization
 * @throws {NotFoundError} If the organization is not found
 */
export const deleteOrganization = async (
  data: DeleteOrganizationInput,
  repository: OrganizationRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  const { id } = data;

  // Retrieve the organization
  const [organization] = (await repository.read(id)) ?? [];

  if (!organization) {
    throw new NotFoundError("Organization not found");
  }

  // Check permission to delete the organization
  if (!ability.can("delete", subject("Organization", organization))) {
    throw new ForbiddenError("You are not allowed to delete this organization");
  }

  // Delete the organization
  await repository.delete(id);
};
