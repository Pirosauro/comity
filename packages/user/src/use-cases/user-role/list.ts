import type { AnyMongoAbility } from "@casl/ability";
import type {
  UserRoleRepository,
  UserRoleResultColumns,
} from "../../repositories/user-role.js";
import type { ListUserRoleInput } from "../../validation/user-role.js";
import { and, eq } from "drizzle-orm";
import { subject } from "@casl/ability";
import { listUserRoleInputSchema } from "../../validation/user-role.js";
import { userRole } from "../../database/user-role.js";
import { role } from "../../database/role.js";

/**
 * Lists user-role assignments with field-level and record-level permission checks.
 *
 * @param repository - UserRoleRepository instance for database operations
 * @param ability - CASL ability object for permission validation
 * @param options - List options:
 *   - columns: Array of user-role column names to select (default: all columns)
 *   - filters: SQL condition for filtering (default: no filter)
 *   - page: Page number for pagination (default: 1)
 *   - limit: Number of records per page (default: 100)
 *
 * @returns Promise<Array<Partial<UserRoleResultColumns>>> - Array of user-role records the ability can read
 *
 * @throws ZodError if options are invalid
 *
 * @remarks
 * - Field-level permissions: Only columns the ability can read are selected.
 * - Record-level permissions: Only records the ability can read are returned.
 * - Uses Zod schema for input validation.
 *
 * @example
 * // List user-role assignments with default options
 * const assignments = await listUserRoles(userRoleRepo, ability);
 *
 * @example
 * // List user-role assignments for a specific user
 * const assignments = await listUserRolesByUserId('user-id', 'channel-id', userRoleRepo, ability, {
 *   columns: ['userId', 'roleId'],
 *   page: 1,
 *   limit: 50
 * });
 */
export async function listUserRoles(
  repository: UserRoleRepository,
  ability: AnyMongoAbility,
  options: Partial<ListUserRoleInput> = {}
): Promise<Partial<UserRoleResultColumns>[]> {
  const { columns, filters, page, limit } =
    listUserRoleInputSchema.parse(options);

  // Fetch users from repository with filtering and pagination
  const result =
    (await repository.list({
      columns: columns.filter((c) => ability.can("read", "UserRole", c)),
      filters,
      page,
      limit,
    })) ?? [];

  // Filter records based on record-level read permissions
  return result.filter((user) =>
    ability.can("read", subject("UserRole", user))
  );
}

/**
 * Utility: Lists user-role assignments for a specific userId and channelId.
 *
 * @param userId - User identifier
 * @param channelId - Channel identifier
 * @param repository - UserRoleRepository instance for database operations
 * @param ability - CASL ability object for permission validation
 * @param options - List options (columns, page, limit)
 *
 * @returns Promise<Array<Partial<UserRoleResultColumns>>> - Array of user-role records for the user and channel
 *
 * @throws ZodError if options are invalid
 *
 * @example
 * const assignments = await listUserRolesByUserId('user-id', 'channel-id', userRoleRepo, ability, {
 *   columns: ['userId', 'roleId'],
 *   page: 1,
 *   limit: 25
 * });
 */
export async function listUserRolesByUserId(
  userId: string,
  channelId: string,
  repository: UserRoleRepository,
  ability: AnyMongoAbility,
  options: Partial<ListUserRoleInput> = {}
): Promise<Partial<UserRoleResultColumns>[]> {
  options.filters = and(
    eq(userRole.userId, userId),
    eq(role.channelId, channelId)
  );

  return listUserRoles(repository, ability, options);
}
