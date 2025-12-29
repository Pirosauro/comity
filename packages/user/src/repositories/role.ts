import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import type { RoleColumns } from "../database/role.js";
import { eq } from "drizzle-orm";
import { DatabaseRepository } from "@comity/database";
import { role } from "../database/role.js";

export type RoleResultColumns = RoleColumns;

export type RoleRepositoryOptions = {
  columns?: (keyof RoleColumns)[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing role entities.
 *
 * @remarks
 * - All queries return a Drizzle ORM query builder for further chaining or execution.
 * - Pagination in `list` uses offset-based approach (may not be optimal for very large datasets).
 * - Default limit in `list` is 100 to prevent accidental large queries.
 */
export class RoleRepository extends DatabaseRepository {
  /**
   * Builds a base query with dynamic column selection.
   *
   * @param columns - Array of role column names to select (default: all columns).
   * @returns Drizzle ORM query builder for further chaining or execution.
   *
   * @example
   * // Select only id and name columns
   * repo.init(['id', 'name']);
   */
  private init(columns: RoleRepositoryOptions["columns"] = []) {
    const roleColumns: SelectedFields = {};

    columns.forEach((column) => {
      roleColumns[column] = role[column as keyof RoleColumns];
    });

    const select: any = { ...roleColumns };

    return this.db.select(select).from(role);
  }

  /**
   * Retrieves a single role by its unique identifier.
   *
   * @param id - Role ID.
   * @param columns - Array of columns to select (default: all columns).
   * @returns Drizzle ORM query builder.
   *
   * @example
   * const role = await repo.read('role-id').execute();
   */
  public read(id: string, columns: RoleRepositoryOptions["columns"] = []) {
    return this.init(columns).where(eq(role.id, id));
  }

  /**
   * Lists roles with optional filtering and pagination.
   *
   * @param options - Pagination, column selection, and filter options.
   *   - columns: Array of role column names to select (default: all columns)
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
   * // Get all roles (first 100)
   * const roles = await repo.list().execute();
   *
   * // Paginated results with only essential fields
   * const roles = await repo.list({
   *   page: 2,
   *   limit: 25,
   *   columns: ['id', 'name']
   * }).execute();
   */
  public list(options: RoleRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Creates one or more roles in the database.
   *
   * @param data - Role data or array of role data.
   * @returns Drizzle ORM query builder.
   *
   * @example
   * await repo.create({ name: 'admin', description: 'Administrator role' });
   */
  public create(
    data: InferInsertModel<typeof role> | InferInsertModel<typeof role>[]
  ) {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return this.db.insert(role).values(data);
  }

  /**
   * Updates an existing role by its identifier.
   *
   * @param id - Role ID.
   * @param data - Partial role data to update.
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Returns the number of affected rows; does not throw if not found.
   *
   * @example
   * await repo.update('role-id', { name: 'editor' });
   */
  public update(id: string, data: Partial<InferInsertModel<typeof role>>) {
    if (data.id) data.id = id;

    return this.db.update(role).set(data).where(eq(role.id, id));
  }

  /**
   * Permanently deletes a role from the database.
   *
   * @param id - Role ID.
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Returns the number of affected rows; does not throw if not found.
   *
   * @example
   * await repo.delete('role-id');
   */
  public delete(id: string) {
    return this.db.delete(role).where(eq(role.id, id));
  }
}
