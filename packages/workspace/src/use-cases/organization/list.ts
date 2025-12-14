import type { AnyMongoAbility } from "@casl/ability";
import type { ListOrganizationInput } from "../../validation/organization.js";
import type { OrganizationRepository } from "../../repositories/organization.js";
import { subject } from "@casl/ability";

/**
 * List organizations with pagination and filtering
 *
 * This use case retrieves a paginated list of organizations that the user
 * has permission to read. It applies soft field-level permissions by
 * filtering the columns based on the user's ability.
 *
 * @param data - The list parameters including columns, filters, pagination
 * @param repository - The organization repository instance
 * @param ability - The user's CASL ability for permission checking
 * @returns Array of organization records that the user has permission to read
 *
 * @remarks
 * **Soft Field Permissions:**
 * - Filters requested columns based on field-level read permissions before database query
 * - Returns only authorized fields gracefully (no errors for unauthorized fields)
 *
 * **Record-Level Permissions:**
 * - Applies record-level permissions after fetching data
 * - Only returns organizations that the ability can read
 * - Silently filters out unauthorized records
 */
export const listOrganizations = async (
  data: ListOrganizationInput,
  repository: OrganizationRepository,
  ability: AnyMongoAbility
): Promise<Record<string, unknown>[]> => {
  // Apply soft field-level permissions - filter columns based on ability
  const allowedColumns = data.columns.filter((column) =>
    ability.can("read", "Organization", column)
  );

  // Fetch organizations from repository with filtering and pagination
  const result =
    (await repository.list({
      columns: allowedColumns,
      filters: data.filters,
      page: data.page,
      limit: data.limit,
    })) ?? [];

  // Apply record-level read permissions (soft approach)
  return result.filter((organization) =>
    ability.can("read", subject("Organization", organization))
  );
};
