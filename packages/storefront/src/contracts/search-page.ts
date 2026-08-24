import type { ProductProjection } from "@comity/catalog";
import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { SearchResultModel } from "@comity/search";
import type { StorefrontContext } from "./context.js";
import type { StorefrontPageModel } from "./page.js";

/**
 * Search page model for storefront.
 */
export interface SearchPageModel extends StorefrontPageModel {
  /** The type of the page, fixed to "search" for search pages. */
  readonly type: "search";

  /** The search query for the search page. */
  readonly query: string;

  /** Product models for the search page. */
  readonly result: SearchResultModel<ProductProjection>;
}

/**
 * Composer for search pages in the storefront.
 */
export interface SearchPageComposer {
  /**
   * Compose a search page by query and context.
   *
   * @param query - The search query to compose.
   * @param context - The storefront context for the composition, including locale, currency, and tenant information.
   *
   * @returns The composed search page model or an error if the composition fails.
   */
  compose(
    query: string,
    context: StorefrontContext
  ): Promise<Result<SearchPageModel, RepositoryError>>;
}

/**
 * Enricher for search pages in the storefront.
 */
export interface SearchPageEnricher {
  /**
   * Enrich an existing search page model.
   *
   * @param page - The search page model to enrich.
   * @param ctx - The storefront context for enrichment.
   *
   * @returns The enriched search page model or an error if enrichment fails.
   */
  enrich(
    page: SearchPageModel,
    ctx: StorefrontContext
  ): Promise<Result<SearchPageModel, RepositoryError>>;
}
