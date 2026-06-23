import type { CatalogRepositoryContext } from "@comity/catalog";

/**
 * The `CachedCatalogRepositoryContext` interface extends the `CatalogRepositoryContext` by adding an optional `scope` property. This `scope` is used to differentiate cached data for different contexts or tenants, allowing for more granular caching strategies in multi-tenant applications or scenarios where different contexts require separate cache entries. By including the `scope` in the repository context, developers can ensure that cached data is appropriately segmented and retrieved based on the specific context of the request.
 */
export interface CachedCatalogRepositoryContext extends CatalogRepositoryContext {
  /** The scope of the cache, used to differentiate cached data for different contexts or tenants. */
  scope?: string;
}
