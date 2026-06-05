import type { RepositoryError } from "@comity/primitives/error";
import type { Result } from "@comity/primitives/result";
import type { SearchCriteriaModel, SearchResultModel } from "@comity/search";
import type { BlockModel } from "./block.js";
import type { ContentRepositoryContext } from "./repository-context.js";

/**
 * Block repository contract.
 */
export interface BlockRepository {
  /**
   * Retrieve a block by identifier.
   *
   * @param id - Block ID.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Block model or null if not found.
   */
  get<T extends BlockModel = BlockModel>(
    id: string,
    ctx?: ContentRepositoryContext
  ): Promise<Result<T | null, RepositoryError>>;

  /**
   * Retrieve a block by URL slug.
   *
   * @param slug - URL-friendly slug.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Block model or null if not found.
   */
  getBySlug<T extends BlockModel = BlockModel>(
    slug: string,
    ctx?: ContentRepositoryContext
  ): Promise<Result<T | null, RepositoryError>>;

  /**
   * List blocks with optional filtering.
   *
   * @param input - Filter criteria.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Paginated list of blocks.
   */
  list<T extends BlockModel = BlockModel>(
    input: Omit<SearchCriteriaModel, "query">,
    ctx?: ContentRepositoryContext
  ): Promise<Result<SearchResultModel<T>, RepositoryError>>;

  /**
   * Search blocks with query text and optional filtering.
   *
   * @param input - Search criteria including query text and filters.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Paginated search results of blocks.
   */
  search<T extends BlockModel = BlockModel>(
    input: SearchCriteriaModel,
    ctx?: ContentRepositoryContext
  ): Promise<Result<SearchResultModel<T>, RepositoryError>>;
}
