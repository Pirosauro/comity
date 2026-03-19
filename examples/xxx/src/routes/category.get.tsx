import type { Route } from "@comity/router";

import { CACHE_TOKEN } from "@comity/cache";
import { GRAPHQL_CLIENT_TOKEN } from "@comity/graphql-client";
import { CachedCategoryRepository } from "../magento/repositories/cached-category.js";
import { GraphqlCategoryRepository } from "../magento/repositories/category.js";
import { presentCategory } from "../presenters/category.js";
import { presentError } from "../presenters/error.js";
import { renderHtml } from "../renderers/html.js";
import { GetCategory } from "../use-cases/get-category.js";
import { CategoryView } from "../views/category.js";

const route: Route = {
  method: "GET",
  path: "/category",
  handler: async (ctx) => {
    // @ts-expect-error
    const cache = ctx.services.resolve(CACHE_TOKEN);
    // @ts-expect-error
    const graphqlClient = ctx.services.resolve(GRAPHQL_CLIENT_TOKEN);
    const liveRepository = new GraphqlCategoryRepository(graphqlClient);
    const cachedRepository = new CachedCategoryRepository(liveRepository, cache);
    const result = await new GetCategory(cachedRepository).execute("Nw==");
    const contract = result.success ? presentCategory(result) : presentError(result.error);
    const view = <CategoryView {...contract} />;
    const renderResult = await renderHtml(view, {
      status: contract.http?.status ?? 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });

    if (renderResult.ok) {
      return renderResult.value;
    }

    return {
      status: 500,
      body: "Failed to render HTML view",
    };
  },
};

export default route;
