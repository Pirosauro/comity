import type { AnyMongoAbility } from "@casl/ability";
import type {
  UserRepository,
  UserResultColumns,
} from "../../repositories/user.js";
import type { ListUserInput } from "../../validation/user.js";
import { subject } from "@casl/ability";
import { listUserInputSchema } from "../../validation/user.js";

/**
 * Lists users with field-level and record-level permission checks.
 *
 * @param repository - UserRepository instance for database operations
 * @param ability - CASL ability object for permission validation
 * @param options - List options:
 *   - columns: Array of user column names to select (default: all columns)
 *   - filters: Array of SQL conditions for filtering (default: no filter)
 *   - page: Page number for pagination (default: 1)
 *   - limit: Number of records per page (default: 100)
 *
 * @returns Promise<Array<Partial<UserResultColumns>>> - Array of user records the ability can read
 *
 * @throws ZodError if options are invalid
 *
 * @remarks
 * - Field-level permissions: Only columns the ability can read are selected.
 * - Record-level permissions: Only records the ability can read are returned.
 * - Uses Zod schema for input validation.
 *
 * @example
 * // List users with default options
 * const users = await listUsers(userRepo, ability);
 *
 * @example
 * // List users with specific columns and pagination
 * const users = await listUsers(userRepo, ability, {
 *   columns: ['id', 'name', 'email'],
 *   page: 2,
 *   limit: 50
 * });
 */
export async function listUsers(
  repository: UserRepository,
  ability: AnyMongoAbility,
  options: Partial<ListUserInput> = {}
): Promise<Partial<UserResultColumns>[]> {
  const { columns, filters, page, limit } = listUserInputSchema.parse(options);

  // Fetch users from repository with filtering and pagination
  const result =
    (await repository.list({
      columns: columns.filter((c) => ability.can("read", "User", c)),
      filters,
      page,
      limit,
    })) ?? [];

  // Filter records based on record-level read permissions
  return result.filter((user) => ability.can("read", subject("User", user)));
}
