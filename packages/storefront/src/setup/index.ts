import type { CatalogModuleContext } from "@comity/catalog";
import type { ModuleMeta } from "@comity/composition";
import type {
  StorefrontModuleContext,
  StorefrontModuleOptions,
  StorefrontOptions,
} from "./types.js";

import { CATEGORY_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN } from "@comity/catalog";
import { success } from "@comity/primitives/result";
import { DefaultCategoryPageComposer } from "../composers/category.js";
import { DefaultProductPageComposer } from "../composers/product.js";
import { CATEGORY_PAGE_COMPOSER_TOKEN, PRODUCT_PAGE_COMPOSER_TOKEN } from "./constants.js";

export const module: ModuleMeta<
  StorefrontModuleOptions,
  StorefrontModuleContext & CatalogModuleContext
> = {
  name: "@comity/storefront",
  version: "0.9.0",

  dependsOn: {
    // "@comity/catalog": { optional: false },
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

    const enrichers =
      (await ctx.hooks.execute("@comity/storefront:configuring", initial)) ?? initial;

    return success(async () => {
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
            ctx.services.resolve(CATEGORY_REPOSITORY_TOKEN),
            enrichers.category
          )
      );
      // ctx.services.define(CONTENT_PAGE_COMPOSER_TOKEN, () => contentComposer);
      // ctx.services.define(SEARCH_PAGE_COMPOSER_TOKEN, () => searchComposer);

      return success(undefined);
    });
  },
};

export default module;
