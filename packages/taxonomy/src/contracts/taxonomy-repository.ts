import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { TaxonomyRepositoryContext } from "./repository-context.js";
import type { TaxonomyModel } from "./taxonomy.js";

/**
 * Taxonomy repository contract.
 */
export interface TaxonomyRepository {
  /**
   * Retrieve a taxonomy item by identifier.
   *
   * @param id - Taxonomy ID.
   * @param ctx - Context for the repository request, including fields selection, locale, and tenant information.
   *
   * @returns Taxonomy model or null if not found.
   */
  getById(
    id: string,
    ctx?: TaxonomyRepositoryContext
  ): Promise<Result<TaxonomyModel | null, RepositoryError>>;

  /**
   * Retrieve a taxonomy item by URL slug.
   *
   * @param slug - URL-friendly slug.
   * @param ctx - Context for the repository request, including fields selection, locale, and tenant information.
   *
   * @returns Taxonomy model or null if not found.
   */
  getBySlug(
    slug: string,
    ctx?: TaxonomyRepositoryContext
  ): Promise<Result<TaxonomyModel | null, RepositoryError>>;

  /**
   * Search taxonomy items with optional query text and filtering.
   *
   * @param input - Search criteria; a textual query is optional. Filter-only
   * retrieval is expressed by omitting `query`.
   * @param ctx - Context for the repository request, including fields selection, locale, and tenant information.
   *
   * @returns Paginated search results of taxonomy models.
   */
  search(
    input: SearchCriteriaModel,
    ctx?: TaxonomyRepositoryContext
  ): Promise<Result<SearchResultModel<TaxonomyModel>, RepositoryError>>;
}