import type { ProductRepository } from "@comity/catalog";
import type { RepositoryError } from "@comity/primitives/errors";
import { isSuccess, success, type Result } from "@comity/primitives/result";
import type { StorefrontContext } from "../contracts/context.js";
import type {
    SearchPageComposer,
    SearchPageEnricher,
    SearchPageModel,
} from "../contracts/search-page.js";

/**
 * Default implementation of the SearchPageComposer interface.
 */
export class DefaultSearchPageComposer implements SearchPageComposer {
  /** Product repository. */
  #repository: ProductRepository;

  /** Page enrichers. */
  #enrichers: ReadonlyArray<SearchPageEnricher>;

  /**
   * @param repository - Product repository used to execute search queries.
   * @param enrichers - Optional enrichers to apply after base composition.
   */
  constructor(repository: ProductRepository, enrichers?: ReadonlyArray<SearchPageEnricher>) {
    this.#repository = repository;
    this.#enrichers = enrichers ?? [];
  }

  /**
   * @inheritdoc
   */
  async compose(
    query: string,
    ctx: StorefrontContext
  ): Promise<Result<SearchPageModel, RepositoryError>> {
    const result = await this.#repository.search({ query }, ctx);

    if (isSuccess(result)) {
      let page: SearchPageModel = {
        type: "search",
        id: "search",
        url: `/search?q=${encodeURIComponent(query)}`,
        title: query ? `Search: ${query}` : "Search",
        query,
        result: result.value,
      };

      for (const enricher of this.#enrichers) {
        const enriched = await enricher.enrich(page, ctx);

        if (isSuccess(enriched)) {
          page = enriched.value;
        }
      }

      return success(page);
    }

    return result;
  }
}
