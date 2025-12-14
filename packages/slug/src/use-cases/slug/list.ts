import type { AnyMongoAbility } from "@casl/ability";
import type {
  SlugRepository,
  SlugResultColumns,
} from "../../repositories/slug.js";
import type { ListSlugInput } from "../../validation/slug.js";
import { subject } from "@casl/ability";
import { listSlugInputSchema } from "../../validation/slug.js";

/**
 * Lists slugs with pagination and optional filtering, with permission validation using CASL ability system.
 *
 * @param repository - Slug repository for database operations
 * @param ability - CASL ability instance for permission validation
 * @param options - Configuration options for column selection, filtering, and pagination
 *   - columns: Array of slug column names to select (default: all columns)
 *   - filters: SQL condition for filtering (default: no filter)
 *   - page: Page number for pagination (default: 1, one-based)
 *   - limit: Number of items per page (default: 100)
 *
 * @returns Promise<Array<Partial<SlugResultColumns>>> - Array of slug data that the ability has permission to read
 *
 * @throws ZodError if options are invalid
 *
 * @remarks
 * **Soft Field Permissions:**
 * - Uses soft approach for field-level permissions
 * - Filters requested columns based on field-level read permissions before database query
 * - Returns only authorized fields gracefully (no errors for unauthorized fields)
 *
 * **Record-Level Permissions:**
 * - Applies record-level permissions after fetching data
 * - Only returns slugs that the ability can read
 * - Silently filters out unauthorized records
 *
 * **Performance Considerations:**
 * - Optimizes database queries by pre-filtering columns
 * - Supports pagination to handle large datasets
 * - Uses replica database for read operations
 *
 * @example
 * // Basic slug listing with default permissions
 * const slugs = await listSlugs(slugRepo, ability, { page: 1, limit: 50 });
 *
 * @example
 * // Filtered listing with specific columns
 * import { eq } from "drizzle-orm";
 * import { slug } from "../../schema/slug.js";
 * const activeSlugs = await listSlugs(
 *   slugRepo,
 *   ability,
 *   {
 *     columns: ['id', 'source', 'target', 'status'],
 *     filters: eq(slug.status, 'active'),
 *     page: 1,
 *     limit: 25
 *   }
 * );
 */
export const listSlugs = async (
  repository: SlugRepository,
  ability: AnyMongoAbility,
  options: Partial<ListSlugInput> = {}
): Promise<Partial<SlugResultColumns>[]> => {
  const { columns, filters, page, limit } = listSlugInputSchema.parse(options);

  // Fetch slugs from repository with filtering and pagination
  const result =
    (await repository.list({
      columns: columns.filter((c) => ability.can("read", "Slug", c)),
      filters,
      page,
      limit,
    })) ?? [];

  // Filter records based on record-level read permissions
  return result.filter((slug) => ability.can("read", subject("Slug", slug)));
};
