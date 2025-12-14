import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import type {
  OrganizationColumns,
  WorkspaceColumns,
  TenantColumns,
} from "../database/index.js";
import { and, eq } from "drizzle-orm";
import { PostgresRepository } from "@comity/postgres";
import { workspaces } from "../database/workspaces.js";
import { organizations } from "../database/organizations.js";
import { tenants } from "../database/tenants.js";

export type WorkspaceResultColumns = WorkspaceColumns & {
  organization: OrganizationColumns & {
    tenant: TenantColumns;
  };
};

export type WorkspaceRepositoryOptions = {
  columns?: (
    | keyof WorkspaceColumns
    | `organization.${keyof OrganizationColumns}`
    | `organization.tenant.${keyof TenantColumns}`
  )[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing workspace entities with automatic organization join capabilities.
 *
 * @remarks
 * - Requesting any `organization.*` column triggers an INNER JOIN with the organization table.
 * - All joins are INNER JOINs, so workspaces without valid organization relationships will be excluded.
 * - All queries return a Drizzle ORM query builder for further chaining or execution.
 */
export class WorkspaceRepository extends PostgresRepository {
  /**
   * Builds a base query with dynamic column selection and table joins.
   *
   * @remarks
   * Automatically determines if organization table needs to be joined based on requested columns.
   * Uses INNER JOIN which will exclude workspaces without valid organization relationships.
   *
   * @param columns - Column selection array. Defaults to all workspace columns if empty.
   *
   * @example
   * ```typescript
   * // Select specific workspace columns only
   * init(['id', 'code', 'status'])
   *
   * // Include organization data (triggers organization join)
   * init(['id', 'code', 'organization.code', 'organization.description'])
   * ```
   */
  private init(columns: WorkspaceRepositoryOptions["columns"] = []) {
    const workspaceColumns: SelectedFields = {};
    const organizationColumns: SelectedFields = {};
    const tenantColumns: SelectedFields = {};

    // Process column requests
    columns.forEach((column) => {
      if (column.startsWith("organization.tenant.")) {
        const field = column.slice("organization.tenant.".length);

        tenantColumns[field] = tenants[field as keyof TenantColumns];
      } else if (column.startsWith("organization.")) {
        const field = column.slice("organization.".length);

        organizationColumns[field] =
          organizations[field as keyof OrganizationColumns];
      } else {
        workspaceColumns[column] = workspaces[column as keyof WorkspaceColumns];
      }
    });

    // Determine if we need to join organization table or tenant table based on selected columns
    const joinOrganization = Object.keys(organizationColumns).length > 0;
    const joinTenant = Object.keys(tenantColumns).length > 0;
    // Build the select object with nested structure
    const select: any = {
      ...workspaceColumns,
    };

    // Add organization object if organization columns are requested
    if (joinOrganization || joinTenant) {
      select.organization = {
        ...organizationColumns,
      };
    }

    // Add tenant object if tenant columns are requested
    if (joinTenant) {
      select.organization.tenant = tenantColumns;
    }

    // Build the base query
    const query = this.db.select(select).from(workspaces);

    // Join organization table if needed
    if (joinOrganization) {
      query.innerJoin(
        organizations,
        eq(workspaces.organizationId, organizations.id)
      );
    }

    return query;
  }

  /**
   * Retrieves a single workspace by its unique identifier.
   *
   * @param id - Workspace identifier
   * @param columns - Optional column selection for performance optimization
   *
   * @remarks
   * Returns a query builder that needs to be executed with `.execute()` or similar.
   *
   * @example
   * ```typescript
   * // Get basic workspace info
   * const workspace = await repo.read('workspace-123').execute();
   *
   * // Get workspace with organization details
   * const workspaceWithOrganization = await repo.read('workspace-123', [
   *   'id', 'code', 'organization.code', 'organization.description'
   * ]).execute();
   * ```
   */
  public read(id: string, columns: WorkspaceRepositoryOptions["columns"] = []) {
    return this.init(columns).where(eq(workspaces.id, id));
  }

  /**
   * Finds a workspace by its unique code within an organization.
   *
   * @param code - The workspace code to search for
   * @param organizationId - The organization ID to scope the search
   * @param columns - Optional column selection for performance optimization
   *
   * @remarks
   * Workspace codes are unique within each organization.
   *
   * @example
   * ```typescript
   * const workspace = await repo.readByCode('WS_001', 'org-123').execute();
   * ```
   */
  public readByCode(
    code: string,
    organizationId: string,
    columns: WorkspaceRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(
      and(
        eq(workspaces.code, code),
        eq(workspaces.organizationId, organizationId)
      )
    );
  }

  /**
   * Lists workspaces with optional filtering and pagination.
   *
   * @param options - Pagination and column selection options.
   *   - columns: Array of workspace/organization column names to select (default: all workspace columns)
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
   * - Requesting any `organization.*` column triggers an INNER JOIN with the organization table.
   *
   * @example
   * // Get all active workspaces
   * const activeWorkspaces = await repo.list({
   *   filters: eq(workspaces.status, 'active')
   * }).execute();
   *
   * // Paginated results with organization data
   * const workspaces = await repo.list({
   *   page: 2,
   *   limit: 25,
   *   columns: ['id', 'code', 'organization.code']
   * }).execute();
   */
  public list(options: WorkspaceRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Creates one or more workspaces in the database.
   *
   * @param data - Single workspace object or array of workspace objects
   *
   * @remarks
   * - Automatically normalizes single objects to arrays for consistent processing
   * - Will throw constraint violations if code uniqueness within organization is violated
   * - All workspaces in a batch are inserted in a single transaction
   * - IDs and timestamps are automatically generated if not provided
   *
   * @example
   * ```typescript
   * // Create single workspace
   * await repo.create({
   *   organizationId: 'org-123',
   *   code: 'WS_001',
   *   name: 'Production',
   *   type: 'default',
   *   status: 'active'
   * });
   *
   * // Batch create multiple workspaces
   * await repo.create([
   *   { organizationId: 'org-1', code: 'WS_A', name: 'Development', type: 'default', status: 'active' },
   *   { organizationId: 'org-1', code: 'WS_B', name: 'Staging', type: 'default', status: 'active' }
   * ]);
   * ```
   */
  public create(
    data:
      | InferInsertModel<typeof workspaces>
      | InferInsertModel<typeof workspaces>[]
  ) {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return this.db.insert(workspaces).values(data);
  }

  /**
   * Updates an existing workspace by its identifier.
   *
   * @param id - Workspace identifier to update
   * @param data - Partial workspace data with updates
   *
   * @remarks
   * - The ID field is automatically excluded from updates to prevent primary key violations
   * - Only provided fields will be updated (partial update)
   * - Uses optimistic locking - no verification that the record exists before update
   * - Timestamp fields are automatically updated
   *
   * @example
   * ```typescript
   * // Update workspace status
   * await repo.update('workspace-123', {
   *   status: 'inactive'
   * });
   * ```
   */
  public update(
    id: string,
    data: Partial<InferInsertModel<typeof workspaces>>
  ) {
    // Force correct ID - parameter takes precedence
    if (data.id) data.id = id;

    return this.db.update(workspaces).set(data).where(eq(workspaces.id, id));
  }

  /**
   * Soft deletes a workspace from the database.
   *
   * @param id - Workspace identifier to delete
   *
   * @remarks
   * This is a soft delete operation that sets the deletedAt timestamp.
   *
   * @example
   * ```typescript
   * await repo.delete('workspace-123');
   * ```
   */
  public delete(id: string) {
    return this.db
      .update(workspaces)
      .set({ deletedAt: new Date() })
      .where(eq(workspaces.id, id));
  }
}
