import type { ProductModel } from "@comity/catalog";
import type { BreadcrumbModel } from "@comity/content";
import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { StorefrontContext } from "./context.js";
import type { StorefrontPageModel } from "./page.js";

/**
 * Product page model for storefront.
 */
export interface ProductPageModel extends StorefrontPageModel {
  /** The type of the page, fixed to "product" for product pages. */
  readonly type: "product";

  /** Product model for the product page. */
  readonly product: ProductModel | null;

  /** Breadcrumbs for the product page. */
  readonly breadcrumbs?: readonly BreadcrumbModel[];
}

/**
 * Composer for product pages in the storefront.
 */
export interface ProductPageComposer {
  /**
   * Compose a product page by ID and context.
   *
   * @param id - The identifier of the product to compose.
   * @param context - The storefront context for the composition, including locale, currency, and tenant information.
   *
   * @returns The composed product page model or an error if the composition fails.
   */
  compose(
    id: string,
    context: StorefrontContext
  ): Promise<Result<ProductPageModel, RepositoryError>>;
}

/**
 * Enricher for product pages in the storefront.
 */
export interface ProductPageEnricher {
  /**
   * Enrich an existing product page model.
   *
   * @param page - The product page model to enrich.
   * @param ctx - The storefront context for enrichment.
   *
   * @returns The enriched product page model or an error if enrichment fails.
   */
  enrich(
    page: ProductPageModel,
    ctx: StorefrontContext
  ): Promise<Result<ProductPageModel, RepositoryError>>;
}
