import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import type { UserActivityColumns } from "../database/user-activity.js";
import { eq } from "drizzle-orm";
import { DatabaseRepository } from "@comity/database";
import { userActivity } from "../database/user-activity.js";

export type UserActivityResultColumns = UserActivityColumns;

export type UserActivityRepositoryOptions = {
  columns?: (keyof UserActivityColumns)[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing user activity entities.
 *
 * @remarks
 * - Provides CRUD operations and dynamic column selection for user activities.
 * - All queries return a Drizzle ORM query builder for further chaining or execution.
 * - Pagination in `list` uses offset-based approach (may not be optimal for very large datasets).
 * - Default limit in `list` is 100 to prevent accidental large queries.
 */
export class UserActivityRepository extends DatabaseRepository {
  /**
   * Builds a base query with dynamic column selection.
   *
   * @param columns - Array of user activity column names to select (default: all columns).
   * @returns Drizzle ORM query builder for further chaining or execution.
   *
   * @example
   * // Select only id and type columns
   * repo.init(['id', 'type']);
   */
  private init(columns: UserActivityRepositoryOptions["columns"] = []) {
    const userActivityColumns: SelectedFields = {};

    columns.forEach((column) => {
      userActivityColumns[column] =
        userActivity[column as keyof UserActivityColumns];
    });

    const select: any = { ...userActivityColumns };

    return this.db.select(select).from(userActivity);
  }

  /**
   * Retrieves a single user activity by its unique identifier.
   *
   * @param id - User activity identifier.
   * @param columns - Array of columns to select (default: all columns).
   * @returns Drizzle ORM query builder.
   *
   * @example
   * const activity = await repo.read('activity-id').execute();
   */
  public read(
    id: string,
    columns: UserActivityRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(eq(userActivity.id, id));
  }

  /**
   * Lists user activities with optional filtering and pagination.
   *
   * @param options - Pagination, column selection, and filter options.
   *   - columns: Array of user activity column names to select (default: all columns)
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
   * // Get all activities (first 100)
   * const activities = await repo.list().execute();
   *
   * // Paginated results with only essential fields
   * const activities = await repo.list({
   *   page: 2,
   *   limit: 25,
   *   columns: ['id', 'type']
   * }).execute();
   */
  public list(options: UserActivityRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Creates one or more user activities in the database.
   *
   * @param data - User activity data or array of user activity data.
   * @returns Drizzle ORM query builder.
   *
   * @example
   * await repo.create({ type: 'login', userId: 'user-id' });
   */
  public create(
    data:
      | InferInsertModel<typeof userActivity>
      | InferInsertModel<typeof userActivity>[]
  ) {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return this.db.insert(userActivity).values(data);
  }

  /**
   * Updates an existing user activity by its identifier.
   *
   * @param id - User activity identifier.
   * @param data - Partial user activity data to update.
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Returns the number of affected rows; does not throw if not found.
   *
   * @example
   * await repo.update('activity-id', { type: 'logout' });
   */
  public update(
    id: string,
    data: Partial<InferInsertModel<typeof userActivity>>
  ) {
    if (data.id) data.id = id;

    return this.db
      .update(userActivity)
      .set(data)
      .where(eq(userActivity.id, id));
  }

  /**
   * Permanently deletes a user activity from the database.
   *
   * @param id - User activity identifier.
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Returns the number of affected rows; does not throw if not found.
   *
   * @example
   * await repo.delete('activity-id');
   */
  public delete(id: string) {
    return this.db.delete(userActivity).where(eq(userActivity.id, id));
  }
}
