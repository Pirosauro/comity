import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { PageModel } from "./page.js";
import type { ContentRepositoryContext } from "./repository-context.js";

/**
 * Page repository contract.
 */
export interface PageRepository {
  /**
   * Retrieve a page by identifier.
   *
   * @param id - Page ID.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Page model or null if not found.
   */
  get(
    id: string,
    ctx?: ContentRepositoryContext
  ): Promise<Result<PageModel | null, RepositoryError>>;

  /**
   * Retrieve a page by URL slug.
   *
   * @param slug - URL-friendly slug.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Page model or null if not found.
   */
  getBySlug(
    slug: string,
    ctx?: ContentRepositoryContext
  ): Promise<Result<PageModel | null, RepositoryError>>;

  /**
   * Search pages with optional query text and filtering.
   *
   * @param input - Search criteria; a textual query is optional. Filter-only
   * retrieval is expressed by omitting `query`.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Paginated search results of pages.
   */
  search(
    input: SearchCriteriaModel,
    ctx?: ContentRepositoryContext
  ): Promise<Result<SearchResultModel<PageModel>, RepositoryError>>;
}
