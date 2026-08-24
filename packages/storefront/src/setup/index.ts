import type { CatalogModuleContext } from "@comity/catalog/setup";
import type { ModuleMeta } from "@comity/composition/setup";
import type { TaxonomyModuleContext } from "@comity/taxonomy/setup";
import type {
  StorefrontModuleContext,
  StorefrontModuleOptions,
  StorefrontOptions,
} from "./types.js";

import { PRODUCT_REPOSITORY_TOKEN } from "@comity/catalog/setup";
import { TAXONOMY_REPOSITORY_TOKEN } from "@comity/taxonomy/setup";
import { success } from "@comity/primitives/result";
import { DefaultCategoryPageComposer } from "../composers/category.js";
import { DefaultProductPageComposer } from "../composers/product.js";
import { CATEGORY_PAGE_COMPOSER_TOKEN, PRODUCT_PAGE_COMPOSER_TOKEN } from "./constants.js";

export {
  CATEGORY_PAGE_COMPOSER_TOKEN,
  CONTENT_PAGE_COMPOSER_TOKEN,
  PRODUCT_PAGE_COMPOSER_TOKEN,
  SEARCH_PAGE_COMPOSER_TOKEN,
} from "./constants.js";
export type {
  StorefrontModuleContext,
  StorefrontModuleEvents,
  StorefrontModuleHooks,
  StorefrontModuleOptions,
  StorefrontModuleServices,
} from "./types.js";

export const module: ModuleMeta<
  StorefrontModuleOptions,
  StorefrontModuleContext & CatalogModuleContext & TaxonomyModuleContext
> = {
  name: "@comity/storefront",
  version: "0.9.0",

  dependsOn: {
    "@comity/catalog": { optional: false },
    "@comity/taxonomy": { optional: false },
  },
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: StorefrontOptions = {
      product: [],
      category: [],
      content: [],
      search: [],
    };

    let enrichers: StorefrontOptions = initial;

    // Product
    ctx.services.define(
      PRODUCT_PAGE_COMPOSER_TOKEN,
      () =>
        new DefaultProductPageComposer(
          ctx.services.resolve(PRODUCT_REPOSITORY_TOKEN),
          enrichers.product
        )
    );
    // Cateogory
    ctx.services.define(
      CATEGORY_PAGE_COMPOSER_TOKEN,
      () =>
        new DefaultCategoryPageComposer(
          ctx.services.resolve(TAXONOMY_REPOSITORY_TOKEN),
          enrichers.category
        )
    );
    // ctx.services.define(CONTENT_PAGE_COMPOSER_TOKEN, () => contentComposer);
    // ctx.services.define(SEARCH_PAGE_COMPOSER_TOKEN, () => searchComposer);

    return success(async () => {
      enrichers =
        (await ctx.hooks.execute("@comity/storefront:configuring", initial)) ?? initial;

      return success(undefined);
    });
  },
};

export default module;
