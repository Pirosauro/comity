import type { BreadcrumbModel } from "@comity/content";
import type { RepositoryError } from "@comity/primitives/error";
import type { Result } from "@comity/primitives/result";
import type { StorefrontContext } from "./context.js";
import type { StorefrontPageModel } from "./page.js";

/**
 * Content page model for storefront.
 */
export interface ContentPageModel extends StorefrontPageModel {
  /** The type of the page, fixed to "content" for content pages. */
  readonly type: "content";

  /** Breadcrumbs for the content page. */
  readonly breadcrumbs?: readonly BreadcrumbModel[];
}

/**
 * Composer for content pages in the storefront.
 */
export interface ContentPageComposer {
  /**
   * Compose a content page by ID and context.
   *
   * @param id - The identifier of the content to compose.
   * @param context - The storefront context for the composition, including locale, currency, and tenant information.
   *
   * @returns The composed content page model or an error if the composition fails.
   */
  compose(
    id: string,
    context: StorefrontContext
  ): Promise<Result<ContentPageModel, RepositoryError>>;
}

/**
 * Enricher for content pages in the storefront.
 */
export interface ContentPageEnricher {
  /**
   * Enrich an existing content page model.
   *
   * @param page - The content page model to enrich.
   * @param ctx - The storefront context for enrichment.
   *
   * @returns The enriched content page model or an error if enrichment fails.
   */
  enrich(
    page: ContentPageModel,
    ctx: StorefrontContext
  ): Promise<Result<ContentPageModel, RepositoryError>>;
}
