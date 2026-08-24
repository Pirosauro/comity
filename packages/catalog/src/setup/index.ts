import type { ModuleMeta } from "@comity/composition/setup";
import { success } from "@comity/primitives/result";

import { BRAND_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN } from "./constants.js";
import type {
  CatalogModuleContext,
  CatalogModuleEvents,
  CatalogModuleHooks,
  CatalogModuleServices,
} from "./types.js";

export { BRAND_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN } from "./constants.js";
export type {
  CatalogModuleContext,
  CatalogModuleEvents,
  CatalogModuleHooks,
  CatalogModuleServices,
} from "./types.js";

export type CatalogModuleOptions = {};

export const module: ModuleMeta<CatalogModuleOptions, CatalogModuleContext> = {
  name: "@comity/catalog",
  version: "0.1.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async () => success(async () => success(undefined)),
};

export default module;