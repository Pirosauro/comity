import type { ModuleMeta } from "@comity/composition/setup";
import { success } from "@comity/primitives/result";

import { TAXONOMY_REPOSITORY_TOKEN } from "./constants.js";
import type {
  TaxonomyModuleContext,
  TaxonomyModuleEvents,
  TaxonomyModuleHooks,
  TaxonomyModuleServices,
} from "./types.js";

export { TAXONOMY_REPOSITORY_TOKEN } from "./constants.js";
export type {
  TaxonomyModuleContext,
  TaxonomyModuleEvents,
  TaxonomyModuleHooks,
  TaxonomyModuleServices,
} from "./types.js";

export type TaxonomyModuleOptions = {};

export const module: ModuleMeta<TaxonomyModuleOptions, TaxonomyModuleContext> = {
  name: "@comity/taxonomy",
  version: "0.1.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async () => success(async () => success(undefined)),
};

export default module;