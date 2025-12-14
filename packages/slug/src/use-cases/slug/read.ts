import type { AnyMongoAbility } from "@casl/ability";
import type {
  SlugRepository,
  SlugRepositoryOptions,
  SlugResultColumns,
} from "../../repositories/slug.js";
import type {
  SlugSource,
  SlugId,
  SlugTarget,
  SlugWorkspaceId,
} from "../../validation/slug.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import {
  slugSourceSchema,
  slugColumnsSchema,
  slugIdSchema,
  slugTargetSchema,
} from "../../validation/slug.js";

/**
 * Core function to read a slug by a specified lookup type (id or source).
 *
 * This function implements a secure, performance-optimized slug retrieval pattern with:
 * - CASL ability-based authorization with MongoDB-style queries
 * - Soft field-level permissions that gracefully filter unauthorized fields
 * - Performance optimization through column pre-filtering
 * - Comprehensive error handling with meaningful messages
 *
 * ## Architecture
 *
 * The function follows a three-phase pattern:
 * 1. **Filter Phase**: Pre-filters requested columns based on field permissions
 * 2. **Fetch Phase**: Queries database with only authorized columns
 * 3. **Authorize Phase**: Validates record-level permissions on retrieved data
 *
 * ## Field Permission Model (Soft Approach)
 *
 * Unlike hard permissions that throw errors for unauthorized fields, this function
 * implements "soft" field permissions that gracefully filter out unauthorized fields:
 *
 * - If a field is not authorized → Silently excluded from database query
 * - If no fields are authorized → Returns empty column set (not an error)
 * - Performance benefit: Only fetches data the user can actually see
 *
 * ## Performance Optimization
 *
 * - **Column filtering**: Only requests authorized fields from database
 * - **Index utilization**: Optimized for database index usage on id/source lookups
 * - **Minimal data transfer**: Reduces network overhead by filtering columns early
 *
 * @param type - Lookup strategy: "id" for direct ID lookup, "source" for source-based lookup
 * @param identifier - The search value (slug ID for "id" type, slug source for "source" type)
 * @param repository - Slug repository instance for data access operations
 * @param ability - CASL ability object containing user permissions and field-level access rules
 * @param options - Optional configuration object
 * @param options.columns - Specific columns to retrieve (defaults to all standard slug fields)
 *
 * @returns Promise resolving to complete slug data object with all authorized fields
 *
 * @throws {ForbiddenError} When user lacks record-level read permission for the specific slug
 * @throws {NotFoundError} When no slug exists with the specified id/source value
 *
 * @example
 * // Read slug by ID with default columns
 * const slug = await readSlugBy(
 *   "id",
 *   "slug_123",
 *   slugRepo,
 *   userAbility
 * );
 *
 * // Read slug by source with specific columns
 * const slug = await readSlugBy(
 *   "source",
 *   "/old-path",
 *   slugRepo,
 *   userAbility,
 *   { columns: ["id", "source", "target"] }
 * );
 *
 * // Field permissions automatically filter columns:
 * // If user can only read ["id", "source"] but requests ["id", "source", "meta"]
 * // → Database query will only include ["id", "source"]
 * // → No error thrown, just filtered response
 *
 * @example
 * Reading with soft field permissions
 * // Ability that only allows reading basic fields
 * const limitedAbility = createMongoAbility([
 *   { action: 'read', subject: 'Slug' },
 *   { action: 'read', subject: 'id' },
 *   { action: 'read', subject: 'source' },
 * ]);
 *
 * // Request more fields than allowed - soft approach filters silently
 * const slug = await readSlugBy(
 *   "id",
 *   "slug-123",
 *   repo,
 *   limitedAbility,
 *   { columns: ['id', 'source', 'meta'] }
 * );
 * // Database query will only fetch: ['id', 'source']
 * // Result contains only authorized fields
 *
 * @example
 * Default column selection with permissions
 * // No columns specified - uses default set, filtered by permissions
 * const slug = await readSlugBy("id", "slug-456", repo, ability);
 * // Returns only fields that ability allows from default set:
 * // ['id', 'workspaceId', 'source', 'target', 'meta']
 */
export const readSlugBy = async (
  type: "source" | "target" | "all",
  identifier: SlugSource | SlugTarget,
  workspace: SlugWorkspaceId,
  repository: SlugRepository,
  ability: AnyMongoAbility,
  options: Pick<SlugRepositoryOptions, "columns"> = {}
): Promise<Partial<SlugResultColumns>> => {
  identifier =
    type !== "target"
      ? slugSourceSchema.parse(identifier)
      : slugTargetSchema.parse(identifier);

  // Set default columns if none specified
  options.columns = slugColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "Slug", c));

  // Fetch the slug by source, target or both
  const [slug] =
    type === "source"
      ? (await repository.readBySource(
          identifier,
          workspace,
          options.columns
        )) ?? []
      : type === "target"
      ? (await repository.readByTarget(
          identifier,
          workspace,
          options.columns
        )) ?? []
      : (await repository.readBySourceOrTarget(
          identifier,
          workspace,
          options.columns
        )) ?? [];

  // Check if the slug was found
  if (!slug) {
    throw new NotFoundError(`Slug with ${type} '${identifier}' not found.`);
  }

  // Check if the ability has permission to read the slug
  if (!ability.can("read", subject("Slug", slug))) {
    throw new ForbiddenError(
      `You do not have permission to read slug '${slug.id}' in workspace '${slug.workspaceId}'. Required permission: read Slug.`
    );
  }

  // Return the slug data
  return slug;
};

/**
 * Retrieves a slug by its unique identifier with comprehensive permission validation.
 *
 * This is a convenience wrapper around `readSlugBy` specifically for ID-based lookups.
 * Provides the same security features and performance optimizations as the core function.
 *
 * ## Use Cases
 *
 * - Direct slug retrieval when you have the slug ID
 * - API endpoints that accept slug IDs as path parameters
 * - Internal operations that reference slugs by their primary key
 * - Audit trails and logging that use slug IDs
 *
 * ## Security Features
 *
 * - **Field-level security**: Automatically filters columns based on user permissions
 * - **Record-level security**: Validates user can read this specific slug
 * - **Soft permissions**: Gracefully handles unauthorized field requests
 * - **Channel isolation**: Respects channel-based access controls
 *
 * @param id - The unique slug identifier
 * @param repository - Slug repository instance for database operations
 * @param ability - CASL ability object containing user permissions and field access rules
 * @param options - Optional configuration for customizing the retrieval
 * @param options.columns - Specific fields to retrieve (defaults to standard slug fields)
 *
 * @returns Promise resolving to slug data object with all authorized fields
 *
 * @throws {NotFoundError} When no slug exists with the specified ID
 * @throws {ForbiddenError} When user lacks permission to read the slug or is in wrong channel
 *
 * @example
 * // Basic slug retrieval by ID
 * const slug = await readSlugById(
 *   "slug_123",
 *   slugRepository,
 *   userAbility
 * );
 * console.log(slug.source); // "/old-path"
 *
 * @example
 * // Retrieve specific fields only
 * const basicSlug = await readSlugById(
 *   "slug_123",
 *   slugRepository,
 *   userAbility,
 *   { columns: ["id", "source", "target"] }
 * );
 * // Returns only: { id: "slug_123", source: "/old-path", target: "/new-path" }
 *
 * @example
 * // Error handling for common scenarios
 * try {
 *   const slug = await readSlugById("slug_999", repo, ability);
 * } catch (error) {
 *   if (error instanceof NotFoundError) {
 *     console.log("Slug doesn't exist");
 *   } else if (error instanceof ForbiddenError) {
 *     console.log("User cannot access this slug");
 *   }
 * }
 */
export async function readSlugById(
  id: SlugId,
  repository: SlugRepository,
  ability: AnyMongoAbility,
  options: Pick<SlugRepositoryOptions, "columns"> = {}
): Promise<Partial<SlugResultColumns>> {
  id = slugIdSchema.parse(id);

  // Set default columns if none specified
  options.columns = slugColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "Slug", c));

  // Fetch the slug by source, target or both
  const [slug] = (await repository.read(id, options.columns)) ?? [];

  // Check if the slug was found
  if (!slug) {
    throw new NotFoundError(`Slug with ID '${id}' not found.`);
  }

  // Check if the ability has permission to read the slug
  if (!ability.can("read", subject("Slug", slug))) {
    throw new ForbiddenError(
      `You do not have permission to read slug '${slug.id}' in workspace '${slug.workspaceId}'. Required permission: read Slug.`
    );
  }

  // Return the slug data
  return slug;
}

/**
 * Retrieves a slug by its source with comprehensive permission validation.
 *
 * This is a convenience wrapper around `readSlugBy` specifically for source-based lookups.
 * Slug sources are typically used for redirect or mapping logic.
 *
 * ## Use Cases
 *
 * - Business logic that references slugs by their source path
 * - API endpoints that accept slug sources for user-friendly URLs
 * - Integration points with external systems using slug sources
 * - Administrative interfaces where sources are more meaningful than IDs
 * - Bulk operations and imports that use slug sources as identifiers
 *
 * ## Security Features
 *
 * - **Field-level security**: Automatically filters columns based on user permissions
 * - **Record-level security**: Validates user can read this specific slug
 * - **Soft permissions**: Gracefully handles unauthorized field requests
 * - **Channel isolation**: Respects channel-based access controls
 * - **Source uniqueness**: Leverages database constraints for reliable lookups
 *
 * @param source - The slug source path
 * @param repository - Slug repository instance for database operations
 * @param ability - CASL ability object containing user permissions and field access rules
 * @param options - Optional configuration for customizing the retrieval
 * @param options.columns - Specific fields to retrieve (defaults to standard slug fields)
 *
 * @returns Promise resolving to slug data object with all authorized fields
 *
 * @throws {NotFoundError} When no slug exists with the specified source
 * @throws {ForbiddenError} When user lacks permission to read the slug or is in wrong channel
 *
 * @example
 * // Retrieve slug by source
 * const slug = await readSlugBySource(
 *   "/old-path",
 *   slugRepository,
 *   userAbility
 * );
 * console.log(slug.id); // "slug_123"
 * console.log(slug.target); // "/new-path"
 *
 * @example
 * // Get minimal slug info by source
 * const slugSummary = await readSlugBySource(
 *   "/old-path",
 *   slugRepository,
 *   userAbility,
 *   { columns: ["id", "source", "target"] }
 * );
 *
 * @example
 * // Business logic using slug sources
 * async function processRedirectForSlug(source: string) {
 *   const slug = await readSlugBySource(
 *     source,
 *     slugRepo,
 *     userAbility
 *   );
 *
 *   if (!slug.target) {
 *     throw new Error(`Slug ${slug.source} does not have a target`);
 *   }
 *
 *   return performRedirect(slug.source, slug.target);
 * }
 *
 * @example
 * // Error handling for source lookups
 * try {
 *   const slug = await readSlugBySource("/invalid-path", repo, ability);
 * } catch (error) {
 *   if (error instanceof NotFoundError) {
 *     console.log("No slug found with that source");
 *   } else if (error instanceof ForbiddenError) {
 *     console.log("Access denied for this slug");
 *   }
 * }
 */
export function readSlugBySource(
  source: SlugSource,
  workspace: SlugWorkspaceId,
  repository: SlugRepository,
  ability: AnyMongoAbility,
  options: Pick<SlugRepositoryOptions, "columns"> = {}
): Promise<Partial<SlugResultColumns>> {
  return readSlugBy("source", source, workspace, repository, ability, options);
}

/**
 * Retrieves a slug by its source with comprehensive permission validation.
 *
 * This is a convenience wrapper around `readSlugBy` specifically for source-based lookups.
 *
 * ## Use Cases
 * - Business logic that references slugs by their source path
 * - API endpoints that accept slug sources for user-friendly URLs
 * - Integration points with external systems using slug sources
 * - Administrative interfaces where sources are more meaningful than IDs
 * - Bulk operations and imports that use slug sources as identifiers
 *
 * ## Security Features
 * - **Field-level security**: Automatically filters columns based on user permissions
 * - **Record-level security**: Validates user can read this specific slug
 * - **Soft permissions**: Gracefully handles unauthorized field requests
 * - **Channel isolation**: Respects channel-based access controls
 * - **Source uniqueness**: Leverages database constraints for reliable lookups
 *
 * @param source - The slug source path
 * @param channel - The channel ID for lookup
 * @param repository - Slug repository instance for database operations
 * @param ability - CASL ability object containing user permissions and field access rules
 * @param options - Optional configuration for customizing the retrieval
 * @param options.columns - Specific fields to retrieve (defaults to standard slug fields)
 *
 * @returns Promise resolving to slug data object with all authorized fields
 *
 * @throws {NotFoundError} When no slug exists with the specified source
 * @throws {ForbiddenError} When user lacks permission to read the slug or is in wrong channel
 *
 * @example
 * // Retrieve slug by source
 * const slug = await readSlugBySource(
 *   "/old-path",
 *   "channel-123",
 *   slugRepository,
 *   userAbility
 * );
 *
 * @example
 * // Get minimal slug info by source
 * const slugSummary = await readSlugBySource(
 *   "/old-path",
 *   "channel-123",
 *   slugRepository,
 *   userAbility,
 *   { columns: ["id", "source", "target"] }
 * );
 *
 * @example
 * // Error handling for source lookups
 * try {
 *   const slug = await readSlugBySource("/invalid-path", "channel-123", repo, ability);
 * } catch (error) {
 *   if (error instanceof NotFoundError) {
 *     console.log("No slug found with that source");
 *   } else if (error instanceof ForbiddenError) {
 *     console.log("Access denied for this slug");
 *   }
 * }
 */
/**
 * Retrieves a slug by its source or target with comprehensive permission validation.
 *
 * This is a convenience wrapper around `readSlugBy` for source-or-target lookups.
 * Useful for redirect logic where either source or target may match.
 *
 * @param identifier - The slug source or target path (string)
 * @param channel - The channel ID for lookup (string)
 * @param repository - Slug repository instance for database operations
 * @param ability - CASL ability object containing user permissions and field access rules
 * @param options - Optional configuration for customizing the retrieval
 * @param options.columns - Specific fields to retrieve (defaults to standard slug fields)
 *
 * @returns Promise resolving to slug data object with all authorized fields
 *
 * @throws {NotFoundError} When no slug exists with the specified source or target
 * @throws {ForbiddenError} When user lacks permission to read the slug or is in wrong channel
 *
 * @example
 * // Retrieve slug by source or target
 * const slug = await readSlugBySourceOrTarget(
 *   "/old-path",
 *   "channel-123",
 *   slugRepository,
 *   userAbility
 * );
 *
 * @example
 * // Error handling for source-or-target lookups
 * try {
 *   const slug = await readSlugBySourceOrTarget("/invalid-path", "channel-123", repo, ability);
 * } catch (error) {
 *   if (error instanceof NotFoundError) {
 *     console.log("No slug found with that source or target");
 *   } else if (error instanceof ForbiddenError) {
 *     console.log("Access denied for this slug");
 *   }
 * }
 */
export function readSlugByTarget(
  target: SlugTarget,
  workspace: SlugWorkspaceId,
  repository: SlugRepository,
  ability: AnyMongoAbility,
  options: Pick<SlugRepositoryOptions, "columns"> = {}
): Promise<Partial<SlugResultColumns>> {
  return readSlugBy("target", target, workspace, repository, ability, options);
}

/**
 * Retrieves a slug by its source or target with comprehensive permission validation.
 *
 * This is a convenience wrapper around `readSlugBy` for source-or-target lookups.
 * Useful for redirect logic where either source or target may match.
 *
 * @param identifier - The slug source or target path (string)
 * @param channel - The channel ID for lookup (string)
 * @param repository - Slug repository instance for database operations
 * @param ability - CASL ability object containing user permissions and field access rules
 * @param options - Optional configuration for customizing the retrieval
 * @param options.columns - Specific fields to retrieve (defaults to standard slug fields)
 *
 * @returns Promise resolving to slug data object with all authorized fields
 *
 * @throws {NotFoundError} When no slug exists with the specified source or target
 * @throws {ForbiddenError} When user lacks permission to read the slug or is in wrong channel
 *
 * @example
 * // Retrieve slug by source or target
 * const slug = await readSlugBySourceOrTarget(
 *   "/old-path",
 *   "channel-123",
 *   slugRepository,
 *   userAbility
 * );
 *
 * @example
 * // Error handling for source-or-target lookups
 * try {
 *   const slug = await readSlugBySourceOrTarget("/invalid-path", "channel-123", repo, ability);
 * } catch (error) {
 *   if (error instanceof NotFoundError) {
 *     console.log("No slug found with that source or target");
 *   } else if (error instanceof ForbiddenError) {
 *     console.log("Access denied for this slug");
 *   }
 * }
 */
export function readSlugBySourceOrTarget(
  identifier: SlugSource,
  workspace: SlugWorkspaceId,
  repository: SlugRepository,
  ability: AnyMongoAbility,
  options: Pick<SlugRepositoryOptions, "columns"> = {}
): Promise<Partial<SlugResultColumns>> {
  return readSlugBy("all", identifier, workspace, repository, ability, options);
}
