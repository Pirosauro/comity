import type { InferInsertModel, SQL } from "drizzle-orm";
import type { TenantColumns } from "../database/tenants.js";
import { eq } from "drizzle-orm";
import { PostgresRepository } from "@comity/postgres";
import { tenants } from "../database/tenants.js";

export type TenantResultColumns = TenantColumns;

export type TenantRepositoryOptions = {
  columns?: (keyof TenantColumns)[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing tenant entities.
 *
 * @remarks
 * This repository manages tenants which are the top-level entities in the hierarchy.
 * Tenants can have multiple organizations, and each organization can have multiple workspaces.
 * No automatic joins are needed as tenants don't have parent relationships.
 */
export class TenantRepository extends PostgresRepository {
  /**
   * Builds a base query with dynamic column selection.
   *
   * @remarks
   * Tenant repository doesn't require joins as it's the root entity in the hierarchy.
   * Column selection is used purely for performance optimization.
   *
   * @param columns - Column selection array. Defaults to all tenant columns if empty.
   *
   * @example
   * ```typescript
   * // Select specific tenant columns only
   * init(['id', 'name', 'status'])
   *
   * // Select all columns (default behavior)
   * init([])
   * ```
   */
  private init(columns: TenantRepositoryOptions["columns"] = []) {
    return this.db
      .select({
        ...(columns &&
          Object.fromEntries(
            columns.map((key) => [key, tenants[key as keyof TenantColumns]])
          )),
      } as const)
      .from(tenants);
  }

  /**
   * Retrieves a single tenant by its unique identifier.
   *
   * @param id - Tenant identifier
   * @param columns - Optional column selection for performance optimization
   *
   * @remarks
   * Returns a query builder that needs to be executed with `.execute()` or similar.
   *
   * @example
   * ```typescript
   * // Get basic tenant info
   * const tenant = await repo.read('tenant-123').execute();
   *
   * // Get only specific fields
   * const tenantName = await repo.read('tenant-123', [
   *   'id', 'name'
   * ]).execute();
   * ```
   */
  public read(id: string, columns: TenantRepositoryOptions["columns"] = []) {
    return this.init(columns).where(eq(tenants.id, id));
  }

  /**
   * Lists tenants with optional filtering and pagination.
   *
   * @param options - Pagination, column selection, and filter options.
   *   - columns: Array of tenant column names to select (default: all columns)
   *   - filters: SQL condition for filtering (default: no filter)
   *   - page: Page number for pagination (default: 1)
   *   - limit: Number of records per page (default: 100)
   *
   * @returns Drizzle ORM query builder for further chaining or execution.
   *
   * @remarks
   * - All filters are combined using AND logic if multiple are provided.
   * - Pagination uses offset-based approach (may not be optimal for very large datasets).
   * - Default limit is 100 to prevent accidental large queries.
   * - Results are not ordered by default—consider adding orderBy() to the query.
   *
   * @example
   * // Get all active tenants
   * const tenants = await repo.list({
   *   filters: eq(tenants.status, 'active')
   * }).execute();
   *
   * // Paginated results with only essential fields
   * const tenants = await repo.list({
   *   page: 2,
   *   limit: 25,
   *   columns: ['id', 'name', 'status']
   * }).execute();
   */
  public list(options: TenantRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Creates one or more tenants in the database.
   *
   * @param data - Single tenant object or array of tenant objects
   *
   * @remarks
   * - Automatically normalizes single objects to arrays for consistent processing
   * - All tenants in a batch are inserted in a single transaction
   * - IDs and timestamps are automatically generated if not provided
   *
   * @example
   * ```typescript
   * // Create single tenant
   * await repo.create({
   *   name: 'Acme Corporation',
   *   status: 'active',
   *   meta: {
   *     industry: 'Technology',
   *     website: 'https://acme.com',
   *     contactEmail: 'contact@acme.com'
   *   }
   * });
   *
   * // Batch create multiple tenants
   * await repo.create([
   *   { name: 'Tech Corp', status: 'active', meta: { industry: 'Technology' } },
   *   { name: 'Fashion Inc', status: 'active', meta: { industry: 'Retail' } }
   * ]);
   * ```
   */
  public create(
    data: InferInsertModel<typeof tenants> | InferInsertModel<typeof tenants>[]
  ) {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return this.db.insert(tenants).values(data);
  }

  /**
   * Updates an existing tenant by its identifier.
   *
   * @param id - Tenant identifier to update
   * @param data - Partial tenant data with updates
   *
   * @remarks
   * - The ID field is automatically excluded from updates to prevent primary key violations
   * - Only provided fields will be updated (partial update)
   * - Uses optimistic locking - no verification that the record exists before update
   * - updatedAt timestamp is automatically set by the database
   *
   * @example
   * ```typescript
   * // Update tenant name and metadata
   * await repo.update('tenant-123', {
   *   name: 'New Company Name',
   *   meta: {
   *     industry: 'E-commerce',
   *     employees: 500,
   *     lastAudit: '2024-01-15'
   *   }
   * });
   *
   * // Partial update - only status
   * await repo.update('tenant-456', {
   *   status: 'suspended'
   * });
   * ```
   */
  public update(id: string, data: Partial<InferInsertModel<typeof tenants>>) {
    // Force correct ID - parameter takes precedence
    if (data.id) data.id = id;

    return this.db.update(tenants).set(data).where(eq(tenants.id, id));
  }

  /**
   * Soft deletes a tenant from the database.
   *
   * @param id - Tenant identifier to delete
   *
   * @remarks
   * This is a soft delete operation that sets the deletedAt timestamp.
   * **WARNING**: Related organizations and workspaces may also need to be handled.
   * Ensure all dependent data has been properly handled before deletion.
   *
   * @example
   * ```typescript
   * await repo.delete('tenant-123');
   * ```
   */
  public delete(id: string) {
    return this.db
      .update(tenants)
      .set({ deletedAt: new Date() })
      .where(eq(tenants.id, id));
  }
}
