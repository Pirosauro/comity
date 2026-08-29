import type { ModuleMeta } from "@comity/composition/setup";
import { success } from "@comity/primitives/result";

import type { CatalogModuleContext } from "./types.js";

export type CatalogModuleOptions = {};

export default {
  name: "@comity/catalog",
  version: "0.1.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async () => success(async () => success(undefined)),
} satisfies ModuleMeta<CatalogModuleOptions, CatalogModuleContext>;
