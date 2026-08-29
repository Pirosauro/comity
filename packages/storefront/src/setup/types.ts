import type { ModuleSetupContext } from "@comity/composition/setup";
import type { CategoryPageComposer, CategoryPageEnricher } from "../contracts/category-page.js";
import type { ContentPageComposer, ContentPageEnricher } from "../contracts/content-page.js";
import type { ProductPageComposer, ProductPageEnricher } from "../contracts/product-page.js";
import type { SearchPageComposer, SearchPageEnricher } from "../contracts/search-page.js";
import type {
  CATEGORY_PAGE_COMPOSER_TOKEN,
  CONTENT_PAGE_COMPOSER_TOKEN,
  PRODUCT_PAGE_COMPOSER_TOKEN,
  SEARCH_PAGE_COMPOSER_TOKEN,
} from "./constants.js";

/**
 * Options for setting up the storefront module.
 */
export interface StorefrontOptions {
  /** Enrichers for the product page. */
  readonly product: ReadonlyArray<ProductPageEnricher>;

  /** Enrichers for the category page. */
  readonly category: ReadonlyArray<CategoryPageEnricher>;

  /** Enrichers for the content page. */
  readonly content: ReadonlyArray<ContentPageEnricher>;

  /** Enrichers for the search page. */
  readonly search: ReadonlyArray<SearchPageEnricher>;
}

/** Hooks exposed by the module */
export type StorefrontModuleHooks = {
  /** Executed during module setup, allows modifying initial configuration */
  "@comity/storefront:configuring": StorefrontOptions;

  /** Executed when the module is initialized. */
  "@comity/storefront:initialized": undefined;
};

/** Events emitted by the module */
export type StorefrontModuleEvents = {};

/**
 * Services exposed by the module
 */
export type StorefrontModuleServices = {
  /** Category page composer token */
  [CATEGORY_PAGE_COMPOSER_TOKEN]: CategoryPageComposer;

  /** Content page composer token */
  [CONTENT_PAGE_COMPOSER_TOKEN]: ContentPageComposer;

  /** Product page composer token */
  [PRODUCT_PAGE_COMPOSER_TOKEN]: ProductPageComposer;

  /** Search page composer token */
  [SEARCH_PAGE_COMPOSER_TOKEN]: SearchPageComposer;
};

/**
 * Context provided to the storefront module setup function.
 */
export interface StorefrontModuleContext extends ModuleSetupContext<
  StorefrontModuleServices,
  StorefrontModuleEvents,
  StorefrontModuleHooks
> {}

/**
 * Options for setting up the storefront module.
 */
export interface StorefrontModuleOptions extends Record<string, unknown> {
  /** Product repository for page composition */
  readonly productRepository?: import("@comity/catalog").ProductRepository;

  /** Taxonomy repository for category page composition */
  readonly taxonomyRepository?: import("@comity/taxonomy").TaxonomyRepository;

  /** Page repository for content page composition */
  readonly pageRepository?: import("@comity/content").PageRepository;
}