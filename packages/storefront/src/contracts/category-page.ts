import type { CategoryModel, ProductModel } from "@comity/catalog";
import type { BreadcrumbModel } from "@comity/content";
import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { StorefrontContext } from "./context.js";
import type { StorefrontPageModel } from "./page.js";

/**
 * Category page model for storefront.
 */
export interface CategoryPageModel extends StorefrontPageModel {
  /** The type of the page, fixed to "category" for category pages. */
  readonly type: "category";

  /** Category model for the category page. */
  readonly category: CategoryModel | null;

  /** Product models for the category page. */
  readonly products: ReadonlyArray<ProductModel>;

  /** Breadcrumbs for the category page. */
  readonly breadcrumbs?: readonly BreadcrumbModel[];
}

/**
 * Composer for category pages in the storefront.
 */
export interface CategoryPageComposer {
  /**
   * Compose a category page by ID and context.
   *
   * @param id - The identifier of the category to compose.
   * @param context - The storefront context for the composition, including locale, currency, and tenant information.
   *
   * @returns The composed category page model or an error if the composition fails.
   */
  compose(
    id: string,
    context: StorefrontContext
  ): Promise<Result<CategoryPageModel, RepositoryError>>;
}

/**
 * Enricher for category pages in the storefront.
 */
export interface CategoryPageEnricher {
  /**
   * Enrich an existing page model.
   *
   * @param page - The category page model to enrich.
   * @param ctx - The storefront context for the enrichment, including locale, currency, and tenant information.
   *
   * @returns The enriched category page model or an error if the enrichment fails.
   */
  enrich(
    page: CategoryPageModel,
    ctx: StorefrontContext
  ): Promise<Result<CategoryPageModel, RepositoryError>>;
}
