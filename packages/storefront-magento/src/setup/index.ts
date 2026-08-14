import type { CacheModuleContext } from "@comity/cache/setup";
import type { CatalogModuleContext } from "@comity/catalog/setup";
import type { ModuleMeta } from "@comity/composition/setup";
import type { GraphqlClientModuleContext } from "@comity/graphql-client/setup";
import type { HttpModuleContext } from "@comity/http/setup";
import type { RouterModuleContext } from "@comity/router/setup";
import type { StorefrontMagentoModuleContext, StorefrontMagentoModuleOptions } from "./types.js";

import { CACHE_TOKEN } from "@comity/cache/setup";
import { CATEGORY_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN } from "@comity/catalog/setup";
import { GraphqlClient } from "@comity/graphql-client";
import { success } from "@comity/primitives/result";
import { MagentoCachedCategoryRepository } from "../repositories/cached-category.js";
import { MagentoCachedProductRepository } from "../repositories/cached-product.js";
import { MagentoGraphqlCategoryRepository } from "../repositories/category.js";
import { MagentoGraphqlProductRepository } from "../repositories/product.js";
import { GraphqlRouteRepository } from "../repositories/route.js";
import { GRAPHQL_CLIENT_MAGENTO_TOKEN } from "./constants.js";
import { MagentoUrlRewriter } from "./url-rewriter.js";

export const module: ModuleMeta<
  StorefrontMagentoModuleOptions,
  StorefrontMagentoModuleContext &
    CacheModuleContext &
    CatalogModuleContext &
    GraphqlClientModuleContext &
    HttpModuleContext &
    RouterModuleContext
> = {
  name: "@comity/storefront-magento",
  version: "0.9.0",

  dependsOn: {
    "@comity/cache": { optional: false },
    "@comity/graphql-client": { optional: false },
    "@comity/http": { optional: false },
    "@comity/storefront": { optional: false },
  },
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    // @ts-ignore
    const initial: StorefrontMagentoModuleOptions = {
      ...options,
    };

    const cfg =
      (await ctx.hooks.execute("@comity/storefront-magento:configuring", initial)) ?? initial;

    const client = new GraphqlClient(cfg.graphql);

    // HTTP middleware configuration
    ctx.hooks.define("@comity/http:configuring", (value, inital) => {
      return {
        ...value,
        middleware: [
          ...(value.middleware ?? []),
          async (c, n) => {
            const storefront = cfg.contextResolver
              ? await cfg.contextResolver.resolve(c.request)
              : undefined;

            if (storefront) {
              c.state["storefront"] = storefront;
            }

            return n();
          },
        ],
      };
    });

    // Router configuration
    ctx.hooks.define("@comity/router:configuring", (value, inital) => {
      // Cache should be on the router to be accessible in the route handlers
      const routeRepository = new GraphqlRouteRepository(client);
      const rewriter = new MagentoUrlRewriter(routeRepository, {
        category: cfg.features?.category ? true : false,
        product: cfg.features?.product ? true : false,
      });

      return {
        ...value,
        rewriters: [...(value.rewriters ?? []), rewriter],
      };
    });

    return success(async () => {
      ctx.services.define(GRAPHQL_CLIENT_MAGENTO_TOKEN, () => client);

      // Category repository
      if (cfg.features?.category) {
        ctx.services.define(
          CATEGORY_REPOSITORY_TOKEN,
          () =>
            new MagentoCachedCategoryRepository(
              new MagentoGraphqlCategoryRepository(client),
              ctx.services.resolve(CACHE_TOKEN)
            )
        );
      }
      // Product repository
      if (cfg.features?.product) {
        ctx.services.define(
          PRODUCT_REPOSITORY_TOKEN,
          () =>
            new MagentoCachedProductRepository(
              new MagentoGraphqlProductRepository(client),
              ctx.services.resolve(CACHE_TOKEN)
            )
        );
      }

      await ctx.hooks.execute("@comity/storefront-magento:initialized", undefined);

      return success(undefined);
    });
  },
};

export default module;
