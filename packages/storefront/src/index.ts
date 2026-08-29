export type {
  CategoryPageComposer,
  CategoryPageEnricher,
  CategoryPageModel,
} from "./contracts/category-page.js";
export type {
  ContentPageComposer,
  ContentPageEnricher,
  ContentPageModel,
} from "./contracts/content-page.js";
export type { StorefrontContext, StorefrontContextResolver } from "./contracts/context.js";
export type { StorefrontPageModel } from "./contracts/page.js";
export type {
  ProductPageComposer,
  ProductPageEnricher,
  ProductPageModel,
} from "./contracts/product-page.js";
export type {
  SearchPageComposer,
  SearchPageEnricher,
  SearchPageModel,
} from "./contracts/search-page.js";
export type { StorefrontErrorMeta, StorefrontErrorReason } from "./errors/storefront-error.js";
export type {
  StorefrontModuleContext,
  StorefrontModuleEvents,
  StorefrontModuleHooks,
  StorefrontModuleOptions,
  StorefrontModuleServices,
} from "./setup/types.js";

export { DefaultCategoryPageComposer } from "./composers/category.js";
export { DefaultContentPageComposer } from "./composers/content.js";
export { DefaultProductPageComposer } from "./composers/product.js";
export { DefaultSearchPageComposer } from "./composers/search.js";
export { StorefrontError } from "./errors/storefront-error.js";
export {
  CATEGORY_PAGE_COMPOSER_TOKEN,
  CONTENT_PAGE_COMPOSER_TOKEN,
  PRODUCT_PAGE_COMPOSER_TOKEN,
  SEARCH_PAGE_COMPOSER_TOKEN,
} from "./setup/constants.js";
