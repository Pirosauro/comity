import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";

import type { ProductProjection } from "./product.js";
import type { CatalogRepositoryContext } from "./repository-context.js";

/**
 * Product repository contract.
 *
 * A read-projection port: exposes only read operations and returns stable,
 * immutable projection models. Mutations live in the application layer.
 */
export interface ProductRepository {
  /**
   * Retrieve a product by identifier.
   *
   * @param id - Product ID.
   * @param ctx - Context for the repository request, including fields selection, locale, and tenant information.
   *
   * @returns Product model or null if not found.
   */
  getById(
    id: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<ProductProjection | null, RepositoryError>>;

  /**
   * Retrieve a product by URL slug.
   *
   * @param slug - URL-friendly slug.
   * @param ctx - Context for the repository request, including fields selection, locale, and tenant information.
   *
   * @returns Product model or null if not found.
   */
  getBySlug(
    slug: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<ProductProjection | null, RepositoryError>>;

  /**
   * Search products with optional query text and filtering.
   *
   * @param input - Search criteria; a textual query is optional. Filter-only
   * retrieval is expressed by omitting `query`.
   * @param ctx - Context for the repository request, including fields selection, locale, and tenant information.
   *
   * @returns Paginated search results of products.
   */
  search(
    input: SearchCriteriaModel,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<SearchResultModel<ProductProjection>, RepositoryError>>;
}