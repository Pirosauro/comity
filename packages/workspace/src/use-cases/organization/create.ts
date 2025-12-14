import type { AnyMongoAbility } from "@casl/ability";
import type { CreateOrganizationInput } from "../../validation/organization.js";
import type { OrganizationRepository } from "../../repositories/organization.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";

/**
 * Create a new organization
 *
 * This use case validates the user's permission to create an organization,
 * then persists the organization to the database.
 *
 * @param data - The organization data to create
 * @param repository - The organization repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to create organizations
 * @throws {Error} If the organization creation fails
 * @returns The created organization ID
 */
export const createOrganization = async (
  data: CreateOrganizationInput,
  repository: OrganizationRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  // Check permission to create organization
  if (!ability.can("create", subject("Organization", data))) {
    throw new ForbiddenError("You are not allowed to create organizations");
  }

  // Create the organization
  await repository.create(data);
};
