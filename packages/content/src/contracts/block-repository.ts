import type { RepositoryError } from "@comity/primitives/errors";
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
  getById<T extends BlockModel = BlockModel>(
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
   * Search blocks with optional query text and filtering.
   *
   * @param input - Search criteria; a textual query is optional. Filter-only
   * retrieval is expressed by omitting `query`.
   * @param ctx - Context for the repository request, including fields selection, locale, currency, and tenant information.
   *
   * @returns Paginated search results of blocks.
   */
  search<T extends BlockModel = BlockModel>(
    input: SearchCriteriaModel,
    ctx?: ContentRepositoryContext
  ): Promise<Result<SearchResultModel<T>, RepositoryError>>;
}
