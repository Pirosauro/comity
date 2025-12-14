import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import type { OrganizationColumns, TenantColumns } from "../database/index.js";
import { and, eq } from "drizzle-orm";
import { PostgresRepository } from "@comity/postgres";
import { organizations } from "../database/organizations.js";
import { tenants } from "../database/tenants.js";

export type OrganizationResultColumns = OrganizationColumns & {
  tenant: TenantColumns;
};

export type OrganizationRepositoryOptions = {
  columns?: (keyof OrganizationColumns | `tenant.${keyof TenantColumns}`)[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing organization entities with automatic tenant join capabilities.
 *
 * @remarks
 * - Requesting any `tenant.*` column triggers an INNER JOIN with the tenant table.
 * - All joins are INNER JOINs, so organizations without valid tenant relationships will be excluded.
 * - All queries return a Drizzle ORM query builder for further chaining or execution.
 */
export class OrganizationRepository extends PostgresRepository {
  /**
   * Builds a base query with dynamic column selection and table joins.
   *
   * @remarks
   * Automatically determines if tenant table needs to be joined based on requested columns.
   * Uses INNER JOIN which will exclude organizations without valid tenant relationships.
   *
   * @param columns - Column selection array. Defaults to all organization columns if empty.
   *
   * @example
   * ```typescript
   * // Select specific organization columns only
   * init(['id', 'code', 'status'])
   *
   * // Include tenant data (triggers tenant join)
   * init(['id', 'code', 'tenant.name'])
   * ```
   */
  private init(columns: OrganizationRepositoryOptions["columns"] = []) {
    const organizationColumns: SelectedFields = {};
    const tenantColumns: SelectedFields = {};

    // Process column requests
    columns.forEach((column) => {
      if (column.startsWith("tenant.")) {
        const field = column.slice("tenant.".length);

        tenantColumns[field] = tenants[field as keyof TenantColumns];
      } else {
        organizationColumns[column] =
          organizations[column as keyof OrganizationColumns];
      }
    });

    // Determine if we need to join tenant table based on selected columns
    const joinTenant = Object.keys(tenantColumns).length > 0;
    // Build the select object with nested structure
    const select: any = {
      ...organizationColumns,
    };

    // Add tenant object if tenant columns are requested
    if (joinTenant) {
      select.tenant = {
        ...tenantColumns,
      };
    }

    // Build the base query
    const query = this.db.select(select).from(organizations);

    // Join tenant table if needed
    if (joinTenant) {
      query.innerJoin(tenants, eq(organizations.tenantId, tenants.id));
    }

    return query;
  }

  /**
   * Retrieves a single organization by its unique identifier.
   *
   * @param id - Organization identifier
   * @param columns - Optional column selection for performance optimization
   *
   * @remarks
   * Returns a query builder that needs to be executed with `.execute()` or similar.
   *
   * @example
   * ```typescript
   * // Get basic organization info
   * const organization = await repo.read('org-123').execute();
   *
   * // Get organization with tenant details
   * const organizationWithTenant = await repo.read('org-123', [
   *   'id', 'code', 'tenant.name'
   * ]).execute();
   * ```
   */
  public read(
    id: string,
    columns: OrganizationRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(eq(organizations.id, id));
  }

  /**
   * Finds an organization by its unique code within a tenant.
   *
   * @param code - The organization code to search for
   * @param tenantId - The tenant ID to scope the search
   * @param columns - Optional column selection for performance optimization
   *
   * @remarks
   * Organization codes are unique within each tenant.
   *
   * @example
   * ```typescript
   * const organization = await repo.readByCode('ORG_001', 'tenant-123').execute();
   * ```
   */
  public readByCode(
    code: string,
    tenantId: string,
    columns: OrganizationRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(
      and(eq(organizations.code, code), eq(organizations.tenantId, tenantId))
    );
  }

  /**
   * Lists organizations with optional filtering and pagination.
   *
   * @param options - Pagination and column selection options.
   *   - columns: Array of organization/tenant column names to select (default: all organization columns)
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
   * - Requesting any `tenant.*` column triggers an INNER JOIN with the tenant table.
   *
   * @example
   * // Get all active organizations
   * const activeOrganizations = await repo.list({
   *   filters: eq(organizations.status, 'active')
   * }).execute();
   *
   * // Paginated results with tenant data
   * const organizations = await repo.list({
   *   page: 2,
   *   limit: 25,
   *   columns: ['id', 'code', 'tenant.name']
   * }).execute();
   */
  public list(options: OrganizationRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Creates one or more organizations in the database.
   *
   * @param data - Single organization object or array of organization objects
   *
   * @remarks
   * - Automatically normalizes single objects to arrays for consistent processing
   * - Will throw constraint violations if code uniqueness within tenant is violated
   * - All organizations in a batch are inserted in a single transaction
   * - IDs and timestamps are automatically generated if not provided
   *
   * @example
   * ```typescript
   * // Create single organization
   * await repo.create({
   *   tenantId: 'tenant-123',
   *   code: 'ORG_001',
   *   description: 'Main organization',
   *   status: 'active',
   *   meta: { region: 'EMEA' }
   * });
   *
   * // Batch create multiple organizations
   * await repo.create([
   *   { tenantId: 'tenant-1', code: 'ORG_A', status: 'active' },
   *   { tenantId: 'tenant-1', code: 'ORG_B', status: 'active' }
   * ]);
   * ```
   */
  public create(
    data:
      | InferInsertModel<typeof organizations>
      | InferInsertModel<typeof organizations>[]
  ) {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return this.db.insert(organizations).values(data);
  }

  /**
   * Updates an existing organization by its identifier.
   *
   * @param id - Organization identifier to update
   * @param data - Partial organization data with updates
   *
   * @remarks
   * - The ID field is automatically excluded from updates to prevent primary key violations
   * - Only provided fields will be updated (partial update)
   * - Uses optimistic locking - no verification that the record exists before update
   * - Timestamp fields are automatically updated
   *
   * @example
   * ```typescript
   * // Update organization status and metadata
   * await repo.update('org-123', {
   *   status: 'inactive',
   *   meta: { reason: 'restructuring' }
   * });
   * ```
   */
  public update(
    id: string,
    data: Partial<InferInsertModel<typeof organizations>>
  ) {
    // Force correct ID - parameter takes precedence
    if (data.id) data.id = id;

    return this.db
      .update(organizations)
      .set(data)
      .where(eq(organizations.id, id));
  }

  /**
   * Soft deletes an organization from the database.
   *
   * @param id - Organization identifier to delete
   *
   * @remarks
   * This is a soft delete operation that sets the deletedAt timestamp.
   * Related workspaces may also need to be handled.
   * Cascade deletes may affect related entities depending on schema configuration.
   *
   * @example
   * ```typescript
   * await repo.delete('org-123');
   * ```
   */
  public delete(id: string) {
    return this.db
      .update(organizations)
      .set({ deletedAt: new Date() })
      .where(eq(organizations.id, id));
  }
}
