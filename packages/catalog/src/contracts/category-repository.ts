import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { CategoryModel } from "./category.js";
import type { CatalogRepositoryContext } from "./repository-context.js";

/**
 * Category repository contract.
 */
export interface CategoryRepository {
  /**
   * Retrieve a category by identifier.
   *
   * @param id - Category ID.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Category model or null if not found.
   */
  get(
    id: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<CategoryModel | null, RepositoryError>>;

  /**
   * Retrieve a category by URL slug.
   *
   * @param slug - URL-friendly slug.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Category model or null if not found.
   */
  getBySlug(
    slug: string,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<CategoryModel | null, RepositoryError>>;

  /**
   * Search categories with optional query text and filtering.
   *
   * @param input - Search criteria; a textual query is optional. Filter-only
   * retrieval is expressed by omitting `query`.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Paginated search results of categories.
   */
  search(
    input: SearchCriteriaModel,
    ctx?: CatalogRepositoryContext
  ): Promise<Result<SearchResultModel<CategoryModel>, RepositoryError>>;
}
