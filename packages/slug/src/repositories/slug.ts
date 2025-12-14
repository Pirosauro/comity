import type { InferInsertModel, SQL } from "drizzle-orm";
import type { SelectedFields } from "drizzle-orm/pg-core";
import type { WorkspaceColumns } from "@comity/workspace/database";
import type { SlugColumns } from "../database/slug.js";
import { and, eq, or } from "drizzle-orm";
import { PostgresRepository } from "@comity/postgres";
import { workspaces } from "@comity/workspace/database";
import { slugs } from "../database/slug.js";

export type SlugResultColumns = SlugColumns & {
  channel?: WorkspaceColumns;
};

export type SlugRepositoryOptions = {
  columns?: (keyof SlugColumns | `workspace.${keyof WorkspaceColumns}`)[];
  filters?: SQL;
  limit?: number;
  page?: number;
};

/**
 * Repository for managing slug entities with automatic channel join capabilities.
 *
 * @remarks
 * - Requesting any `workspace.*` column triggers an INNER JOIN with the channel table.
 * - All joins are INNER JOINs, so slugs without valid channel relationships will be excluded.
 * - All queries return a Drizzle ORM query builder for further chaining or execution.
 */
export class SlugRepository extends PostgresRepository {
  /**
   * Builds a base query with dynamic column selection and table joins.
   *
   * @remarks
   * Automatically determines if vendor table needs to be joined based on requested columns.
   * Uses INNER JOIN which will exclude channels without valid vendor relationships.
   *
   * @param columns - Column selection array. Defaults to all channel columns if empty.
   *
   * @example
   * ```typescript
   * // Select specific channel columns only
   * init(['id', 'code', 'status'])
   *
   * // Include vendor data (triggers vendor join)
   * init(['id', 'code', 'vendor.name', 'vendor.description'])
   * ```
   */
  private init(columns: SlugRepositoryOptions["columns"] = []) {
    const slugColumns: SelectedFields = {};
    const WorkspaceColumns: SelectedFields = {};

    // Process column requests
    columns.forEach((column) => {
      if (column.startsWith("workspace.")) {
        const field = column.slice("workspace.".length);

        WorkspaceColumns[field] = workspaces[field as keyof WorkspaceColumns];
      } else {
        slugColumns[column] = slugs[column as keyof SlugColumns];
      }
    });

    // Determine if we need to join workspace table based on selected columns
    const joinWorkspace = Object.keys(WorkspaceColumns).length > 0;
    // Build the select object with nested structure
    const select: any = {
      ...slugColumns,
    };

    // Add workspace object if workspace columns are requested
    if (joinWorkspace) {
      select.workspace = {
        ...WorkspaceColumns,
      };
    }

    // Build the base query
    const query = this.db.select(select).from(slugs);

    // Join workspace table if needed
    if (joinWorkspace) {
      query.innerJoin(workspaces, eq(slugs.workspaceId, workspaces.id));
    }

    return query;
  }

  /**
   * Retrieves a single channel by its unique identifier.
   *
   * @param id - Channel identifier
   * @param columns - Optional column selection for performance optimization
   *
   * @remarks
   * Returns a query builder that needs to be executed with `.execute()` or similar.
   *
   * @example
   * ```typescript
   * // Get basic channel info
   * const channel = await repo.read('channel-123').execute();
   *
   * // Get channel with vendor details
   * const channelWithVendor = await repo.read('channel-123', [
   *   'id', 'code', 'vendor.name', 'vendor.description'
   * ]).execute();
   * ```
   */
  public read(id: string, columns: SlugRepositoryOptions["columns"] = []) {
    return this.init(columns).where(eq(slugs.id, id));
  }

  /**
   * Finds a channel by its unique code.
   *
   * @param code - The channel code to search for
   * @param columns - Optional column selection for performance optimization
   *
   * @remarks
   * Channel codes are unique across the system and case-sensitive.
   *
   * @example
   * ```typescript
   * const channel = await repo.readByCode('STORE_001').execute();
   * ```
   */
  public readBySource(
    source: string,
    channel: string,
    columns: SlugRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(
      and(eq(slugs.workspaceId, channel), eq(slugs.source, source))
    );
  }

  public readByTarget(
    target: string,
    channel: string,
    columns: SlugRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(
      and(eq(slugs.workspaceId, channel), eq(slugs.target, target))
    );
  }

  public readBySourceOrTarget(
    source: string,
    channel: string,
    columns: SlugRepositoryOptions["columns"] = []
  ) {
    return this.init(columns).where(
      and(
        eq(slugs.workspaceId, channel),
        or(eq(slugs.source, source), eq(slugs.target, source))
      )
    );
  }

  /**
   * Lists channels with optional filtering and pagination.
   *
   * @param options - Pagination and column selection options.
   *   - columns: Array of channel/vendor column names to select (default: all channel columns)
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
   * - Requesting any `vendor.*` column triggers an INNER JOIN with the vendor table.
   *
   * @example
   * // Get all active channels
   * const activeChannels = await repo.list({ filters: eq(workspace.status, 'active') }).execute();
   *
   * // Paginated results with vendor data
   * const channels = await repo.list({
   *   page: 2,
   *   limit: 25,
   *   columns: ['id', 'code', 'vendor.name']
   * }).execute();
   */
  public list(options: SlugRepositoryOptions = {}) {
    const { columns, filters, page = 1, limit = 100 } = options;

    return this.init(columns)
      .where(filters)
      .offset((page - 1) * limit)
      .limit(limit);
  }

  /**
   * Creates one or more slugs in the database.
   *
   * @param data - Single slug object or array of slug objects
   *
   * @remarks
   * - Automatically normalizes single objects to arrays for consistent processing
   * - Will throw constraint violations if uniqueness is violated
   * - All slugs in a batch are inserted in a single transaction
   * - IDs and timestamps are automatically generated if not provided
   *
   * @example
   * ```typescript
   * // Create single slug
   * await repo.create({
   *   workspaceId: 'workspace-123',
   *   source: '/old-path',
   *   target: '/new-path',
   *   meta: { type: 'redirect' }
   * });
   *
   * // Batch create multiple slugs
   * await repo.create([
   *   { workspaceId: 'workspace-1', source: '/a', target: '/b' },
   *   { workspaceId: 'workspace-1', source: '/c', target: '/d' }
   * ]);
   * ```
   */
  public create(
    data: InferInsertModel<typeof slugs> | InferInsertModel<typeof slugs>[]
  ) {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return this.db.insert(slugs).values(data);
  }

  /**
   * Updates an existing slug by its identifier.
   *
   * @param id - Slug identifier to update
   * @param data - Partial slug data with updates
   *
   * @remarks
   * - The ID field is automatically excluded from updates to prevent primary key violations
   * - Only provided fields will be updated (partial update)
   * - Uses optimistic locking - no verification that the record exists before update
   * - Timestamp fields are automatically updated
   *
   * @example
   * ```typescript
   * // Update slug target and metadata
   * await repo.update('slug-123', {
   *   target: '/new-path',
   *   meta: { reason: 'redirect', scheduledRemoval: '2025-01-15' }
   * });
   * ```
   */
  public update(id: string, data: Partial<InferInsertModel<typeof slugs>>) {
    // Force correct ID - parameter takes precedence
    if (data.id) data.id = id;

    return this.db.update(slugs).set(data).where(eq(slugs.id, id));
  }

  /**
   * Permanently deletes a slug from the database.
   *
   * @param id - Slug identifier to delete
   *
   * @remarks
   * This is a hard delete operation. Consider implementing soft deletes for audit trails.
   * Foreign key constraints may prevent deletion if related records exist.
   * Cascade deletes may affect related entities depending on schema configuration.
   *
   * @example
   * ```typescript
   * await repo.delete('slug-123');
   * ```
   */
  public delete(id: string) {
    return this.db.delete(slugs).where(eq(slugs.id, id));
  }
}
