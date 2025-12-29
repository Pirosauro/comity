import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import type { UserRoleColumns } from "../database/user-role.js";
import type { UserColumns } from "../database/user.js";
import type { RoleColumns } from "../database/role.js";
import { and, eq } from "drizzle-orm";
import { DatabaseRepository } from "@comity/database";
import { userRole } from "../database/user-role.js";
import { user } from "../database/user.js";
import { role } from "../database/role.js";

export type UserRoleResultColumns = UserRoleColumns & {
  user: UserColumns;
  role: RoleColumns;
};

export type UserRoleRepositoryOptions = {
  columns?: (
    | keyof UserRoleColumns
    | `role.${keyof RoleColumns}`
    | `user.${keyof UserColumns}`
  )[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing user-role entities.
 *
 * @remarks
 * - Provides CRUD operations and dynamic column selection for user-role assignments.
 * - Requesting any `role.*` or `user.*` column triggers an INNER JOIN with the respective table.
 * - All queries return a Drizzle ORM query builder for further chaining or execution.
 * - Pagination in `list` uses offset-based approach (may not be optimal for very large datasets).
 * - Default limit in `list` is 100 to prevent accidental large queries.
 */
export class UserRoleRepository extends DatabaseRepository {
  /**
   * Builds a base query with dynamic column selection.
   *
   * @param columns - Array of user-role/role/user column names to select (default: all user-role columns).
   * @returns Drizzle ORM query builder for further chaining or execution.
   *
   * @example
   * // Select only userId and roleId columns
   * repo.init(['userId', 'roleId']);
   * // Select user and role names
   * repo.init(['user.name', 'role.name']);
   */
  private init(columns: UserRoleRepositoryOptions["columns"] = []) {
    const userRoleColumns: SelectedFields = {};
    const roleColumns: SelectedFields = {};
    const userColumns: SelectedFields = {};

    // Process column requests
    columns.forEach((column) => {
      if (column.startsWith("role.")) {
        const field = column.slice("role.".length);

        roleColumns[field] = role[field as keyof RoleColumns];
      } else if (column.startsWith("user.")) {
        const field = column.slice("user.".length);

        userColumns[field] = user[field as keyof UserColumns];
      } else {
        userRoleColumns[column] = userRole[column as keyof UserRoleColumns];
      }
    });

    // Determine if we need to join role table based on selected columns
    const joinRole = Object.keys(roleColumns).length > 0;
    const joinUser = Object.keys(userColumns).length > 0;

    // Build the select object with nested structure
    const select: any = { ...userRoleColumns };

    // Add role object if role columns are requested
    if (joinRole) {
      select.role = {
        ...roleColumns,
      };
    }

    // Add user object if user columns are requested
    if (joinUser) {
      select.user = {
        ...userColumns,
      };
    }

    // Build the base query
    const query = this.db.select(select).from(userRole);

    // Join role table if needed
    if (joinRole) {
      query.innerJoin(role, eq(userRole.roleId, role.id));
    }

    // Join user table if needed
    if (joinUser) {
      query.innerJoin(user, eq(userRole.userId, user.id));
    }

    return query;
  }

  /**
   * Retrieves a single user-role assignment by userId and roleId.
   *
   * @param userId - User identifier
   * @param roleId - Role identifier
   * @param columns - Optional column selection
   * @returns Drizzle ORM query builder.
   *
   * @example
   * const assignment = await repo.read('user-id', 'role-id').execute();
   */
  public read(
    userId: string,
    roleId: string,
    columns: UserRoleRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(
      and(eq(userRole.userId, userId), eq(userRole.roleId, roleId))
    );
  }

  /**
   * Lists user-role assignments with optional filtering and pagination.
   *
   * @param options - Pagination and column selection options
   *   - columns: Array of user-role/role/user column names to select (default: all user-role columns)
   *   - filters: SQL condition for filtering (default: no filter)
   *   - page: Page number for pagination (default: 1)
   *   - limit: Number of records per page (default: 100)
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Pagination uses offset-based approach.
   * - Results are not ordered by default—consider adding orderBy() to the query.
   *
   * @example
   * // Get all assignments (first 100)
   * const assignments = await repo.list().execute();
   *
   * // Paginated results with only essential fields
   * const assignments = await repo.list({
   *   page: 2,
   *   limit: 25,
   *   columns: ['userId', 'roleId', 'role.name']
   * }).execute();
   */
  public list(options: UserRoleRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Creates one or more user-role assignments in the database.
   *
   * @param data - Single user-role object or array of user-role objects
   * @returns Drizzle ORM query builder.
   *
   * @example
   * await repo.create({ userId: 'user-id', roleId: 'role-id' });
   */
  public create(
    data:
      | InferInsertModel<typeof userRole>
      | InferInsertModel<typeof userRole>[]
  ) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return this.db.insert(userRole).values(data);
  }

  /**
   * Updates an existing user-role assignment by userId and roleId.
   *
   * @param userId - User identifier
   * @param roleId - Role identifier
   * @param data - Partial user-role data with updates
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Returns the number of affected rows; does not throw if not found.
   *
   * @example
   * await repo.update('user-id', 'role-id', { meta: { active: true } });
   */
  public update(
    userId: string,
    roleId: string,
    data: Partial<InferInsertModel<typeof userRole>>
  ) {
    return this.db
      .update(userRole)
      .set(data)
      .where(and(eq(userRole.userId, userId), eq(userRole.roleId, roleId)));
  }

  /**
   * Permanently deletes a user-role assignment from the database.
   *
   * @param userId - User identifier
   * @param roleId - Role identifier
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Returns the number of affected rows; does not throw if not found.
   *
   * @example
   * await repo.delete('user-id', 'role-id');
   */
  public delete(userId: string, roleId: string) {
    return this.db
      .delete(userRole)
      .where(and(eq(userRole.userId, userId), eq(userRole.roleId, roleId)));
  }
}
