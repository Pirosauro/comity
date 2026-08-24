import type { ModuleSetupContext } from "@comity/composition/setup";

import type { BrandRepository } from "../contracts/brand-repository.js";
import type { ProductRepository } from "../contracts/product-repository.js";
import type { BRAND_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN } from "./constants.js";

/** Hooks exposed by the module */
export type CatalogModuleHooks = {};

/** Events emitted by the module */
export type CatalogModuleEvents = {};

/**
 * Services exposed by the module
 */
export type CatalogModuleServices = {
  /** Product repository resolver token */
  [PRODUCT_REPOSITORY_TOKEN]: ProductRepository;

  /** Brand repository resolver token */
  [BRAND_REPOSITORY_TOKEN]: BrandRepository;
};

/**
 * Context provided to the catalog module setup function.
 */
export interface CatalogModuleContext extends ModuleSetupContext<
  CatalogModuleServices,
  CatalogModuleEvents,
  CatalogModuleHooks
> {}