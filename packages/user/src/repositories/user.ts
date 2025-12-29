import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import type { UserColumns } from "../database/user.js";
import { and, eq } from "drizzle-orm";
import { DatabaseRepository } from "@comity/database";
import { user } from "../database/user.js";

export type UserResultColumns = UserColumns;

export type UserRepositoryOptions = {
  columns?: (keyof UserColumns)[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing user entities.
 *
 * @remarks
 * - Provides CRUD operations and dynamic column selection for users.
 * - All queries return a Drizzle ORM query builder for further chaining or execution.
 * - Pagination in `list` uses offset-based approach (may not be optimal for very large datasets).
 * - Default limit in `list` is 100 to prevent accidental large queries.
 */
export class UserRepository extends DatabaseRepository {
  /**
   * Builds a base query with dynamic column selection.
   *
   * @param columns - Array of user column names to select (default: all columns).
   * @returns Drizzle ORM query builder for further chaining or execution.
   *
   * @example
   * // Select only id and name columns
   * repo.init(['id', 'name']);
   */
  private init(columns: UserRepositoryOptions["columns"] = []) {
    const userColumns: SelectedFields = {};

    columns.forEach((column) => {
      userColumns[column] = user[column as keyof UserColumns];
    });

    const select: any = { ...userColumns };

    return this.db.select(select).from(user);
  }

  /**
   * Retrieves a single user by its unique identifier.
   *
   * @param id - User ID.
   * @param columns - Array of columns to select (default: all columns).
   * @returns Drizzle ORM query builder.
   *
   * @example
   * const user = await repo.read('user-id').execute();
   */
  public read(id: string, columns: UserRepositoryOptions["columns"] = []) {
    return this.init(columns).where(eq(user.id, id));
  }

  /**
   * Retrieves a single user by its identifier and optional provider.
   *
   * @param identifier - The user identifier
   * @param provider - Identity provider (e.g., 'facebook', 'google')
   * @param columns - Optional column selection
   * @returns Drizzle ORM query builder.
   *
   * @example
   * const user = await repo.readByIdentifier('alice@example.com', 'email').execute();
   */
  public readByIdentifier(
    identifier: string,
    provider: string,
    columns: UserRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(
      and(eq(user.identifier, identifier), eq(user.provider, provider))
    );
  }

  /**
   * Lists users with optional filtering and pagination.
   *
   * @param options - Pagination, column selection, and filter options.
   *   - columns: Array of user column names to select (default: all columns)
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
   * // Get all users (first 100)
   * const users = await repo.list().execute();
   *
   * // Paginated results with only essential fields
   * const users = await repo.list({
   *   page: 2,
   *   limit: 25,
   *   columns: ['id', 'name']
   * }).execute();
   */
  public list(options: UserRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Creates one or more users in the database.
   *
   * @param data - User data or array of user data.
   * @returns Drizzle ORM query builder.
   *
   * @example
   * await repo.create({ identifier: 'alice@example.com', provider: 'email' });
   */
  public create(
    data: InferInsertModel<typeof user> | InferInsertModel<typeof user>[]
  ) {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return this.db.insert(user).values(data);
  }

  /**
   * Updates an existing user by its identifier.
   *
   * @param id - User ID.
   * @param data - Partial user data to update.
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Returns the number of affected rows; does not throw if not found.
   *
   * @example
   * await repo.update('user-id', { name: 'Alice' });
   */
  public update(id: string, data: Partial<InferInsertModel<typeof user>>) {
    // Prevent updating the ID
    if (data.id) data.id = id;

    return this.db.update(user).set(data).where(eq(user.id, id));
  }

  /**
   * Permanently deletes a user from the database.
   *
   * @param id - User ID.
   * @returns Drizzle ORM query builder.
   *
   * @remarks
   * - Returns the number of affected rows; does not throw if not found.
   *
   * @example
   * await repo.delete('user-id');
   */
  public delete(id: string) {
    return this.db.delete(user).where(eq(user.id, id));
  }
}
