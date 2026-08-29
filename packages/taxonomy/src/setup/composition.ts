import type { ModuleMeta } from "@comity/composition/setup";
import { success } from "@comity/primitives/result";

import type { TaxonomyModuleContext } from "./types.js";

export type TaxonomyModuleOptions = {};

export default {
  name: "@comity/taxonomy",
  version: "0.1.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async () => success(async () => success(undefined)),
} satisfies ModuleMeta<TaxonomyModuleOptions, TaxonomyModuleContext>;
