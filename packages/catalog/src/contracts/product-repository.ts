import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { ProductModel } from "./product.js";
import type { CatalogRepositoryContext } from "./repository-context.js";

/**
 * Product repository contract.
 */
export interface ProductRepository {
  /**
   * Retrieve a product by identifier.
   *
   * @param id - Product ID.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Product model or null if not found.
   */
  get(
    id: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<ProductModel | null, RepositoryError>>;

  /**
   * Retrieve a product by URL slug.
   *
   * @param slug - URL-friendly slug.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Product model or null if not found.
   */
  getBySlug(
    slug: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<ProductModel | null, RepositoryError>>;

  /**
   * Search products with optional query text and filtering.
   *
   * @param input - Search criteria; a textual query is optional. Filter-only
   * retrieval is expressed by omitting `query`.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Paginated search results of products.
   */
  search(
    input: SearchCriteriaModel,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<SearchResultModel<ProductModel>, RepositoryError>>;
}
