import type { ModuleSetupContext } from "@comity/composition/setup";
import type { CategoryRepository } from "../contracts/category-repository.js";
import type { ProductRepository } from "../contracts/product-repository.js";
import type { CATEGORY_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type CatalogModuleHooks = {};

/** Events emitted by the module */
export type CatalogModuleEvents = {};

/**
 * Services exposed by the module
 */
export type CatalogModuleServices = {
  /** Storefront context resolver token */
  [CATEGORY_REPOSITORY_TOKEN]: CategoryRepository;

  /** Storefront context resolver token */
  [PRODUCT_REPOSITORY_TOKEN]: ProductRepository;
};

/**
 * Context provided to the Magento catalog module setup function.
 */
export interface CatalogModuleContext extends ModuleSetupContext<
  CatalogModuleServices,
  CatalogModuleEvents,
  CatalogModuleHooks
> {}
