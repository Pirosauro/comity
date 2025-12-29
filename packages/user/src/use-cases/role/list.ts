import type { AnyMongoAbility } from "@casl/ability";
import type {
  RoleRepository,
  RoleResultColumns,
} from "../../repositories/role.js";
import type { ListRoleInput } from "../../validation/role.js";
import { eq } from "drizzle-orm";
import { subject } from "@casl/ability";
import { listRoleInputSchema } from "../../validation/role.js";
import { role } from "../../database/role.js";

/**
 * Lists roles with field-level and record-level permission checks.
 *
 * @param repository - RoleRepository instance for database operations
 * @param ability - CASL ability object for permission validation
 * @param options - List options:
 *   - columns: Array of role column names to select (default: all columns)
 *   - filters: Array of SQL conditions for filtering (default: no filter)
 *   - page: Page number for pagination (default: 1)
 *   - limit: Number of records per page (default: 100)
 *
 * @returns Promise<Array<Partial<RoleResultColumns>>> - Array of role records the ability can read
 *
 * @throws ZodError if options are invalid
 *
 * @remarks
 * - Field-level permissions: Only columns the ability can read are selected.
 * - Record-level permissions: Only records the ability can read are returned.
 * - Uses Zod schema for input validation.
 *
 * @example
 * // List roles with default options
 * const roles = await listRoles(roleRepo, ability);
 *
 * @example
 * // List roles with specific columns and pagination
 * const roles = await listRoles(roleRepo, ability, {
 *   columns: ['id', 'name', 'description'],
 *   page: 2,
 *   limit: 50
 * });
 */
export async function listRoles(
  repository: RoleRepository,
  ability: AnyMongoAbility,
  options: Partial<ListRoleInput> = {}
): Promise<Partial<RoleResultColumns>[]> {
  const { columns, filters, page, limit } = listRoleInputSchema.parse(options);

  // Fetch roles from repository with filtering and pagination
  const result =
    (await repository.list({
      columns: columns.filter((c) => ability.can("read", "Role", c)),
      filters,
      page,
      limit,
    })) ?? [];

  // Filter records based on record-level read permissions
  return result.filter((role) => ability.can("read", subject("Role", role)));
}

/**
 * Lists roles filtered by a specific channelId.
 *
 * @param repository - RoleRepository instance for database operations
 * @param ability - CASL ability object for permission validation
 * @param channelId - The channel ID to filter roles by
 * @param options - List options (optional)
 *
 * @returns Promise<Array<Partial<RoleResultColumns>>> - Array of role records for the channel the ability can read
 */
export async function listRolesByChannelId(
  channelId: string,
  repository: RoleRepository,
  ability: AnyMongoAbility,
  options: Partial<ListRoleInput> = {}
): Promise<Partial<RoleResultColumns>[]> {
  options.filters = eq(role.channelId, channelId);

  return listRoles(repository, ability, options);
}
