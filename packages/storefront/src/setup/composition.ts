import type { ModuleMeta } from "@comity/composition/setup";
import { success } from "@comity/primitives/result";

import type { StorefrontModuleContext, StorefrontModuleOptions, StorefrontOptions } from "./types.js";

import { DefaultCategoryPageComposer } from "../composers/category.js";
import { DefaultContentPageComposer } from "../composers/content.js";
import { DefaultProductPageComposer } from "../composers/product.js";
import { DefaultSearchPageComposer } from "../composers/search.js";
import {
  CATEGORY_PAGE_COMPOSER_TOKEN,
  CONTENT_PAGE_COMPOSER_TOKEN,
  PRODUCT_PAGE_COMPOSER_TOKEN,
  SEARCH_PAGE_COMPOSER_TOKEN,
} from "./constants.js";

export default {
  name: "@comity/storefront",
  version: "0.9.0",

  dependsOn: {
    "@comity/catalog": { optional: false },
    "@comity/taxonomy": { optional: false },
    "@comity/content": { optional: false },
  },
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options: StorefrontModuleOptions = {}) => {
    const initial: StorefrontOptions = {
      product: [],
      category: [],
      content: [],
      search: [],
    };

    let enrichers: StorefrontOptions = initial;

    // Execute configuring hook to allow enrichment customization
    enrichers = await ctx.hooks.execute("@comity/storefront:configuring", enrichers);

    // Product
    ctx.services.define(
      PRODUCT_PAGE_COMPOSER_TOKEN,
      () => new DefaultProductPageComposer(options.productRepository!, enrichers.product)
    );

    // Category
    ctx.services.define(
      CATEGORY_PAGE_COMPOSER_TOKEN,
      () => new DefaultCategoryPageComposer(options.taxonomyRepository!, enrichers.category)
    );

    // Content
    ctx.services.define(
      CONTENT_PAGE_COMPOSER_TOKEN,
      () => new DefaultContentPageComposer(options.pageRepository!, enrichers.content)
    );

    // Search
    ctx.services.define(
      SEARCH_PAGE_COMPOSER_TOKEN,
      () => new DefaultSearchPageComposer(options.productRepository!, enrichers.search)
    );

    return success(async () => {
      await ctx.hooks.execute("@comity/storefront:initialized", undefined);
      return success(undefined);
    });
  },
} satisfies ModuleMeta<StorefrontModuleOptions, StorefrontModuleContext>;