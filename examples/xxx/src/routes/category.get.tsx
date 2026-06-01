import type { CacheModuleServices } from "@comity/cache";
import type { GraphqlClientModuleServices } from "@comity/graphql-client";
import type { I18nModuleServices } from "@comity/i18n";
import type { Route } from "@comity/router";
import type { ReactElement } from "react";

import { resolveContract } from "@comity/application";
import { CACHE_TOKEN } from "@comity/cache";
import { GRAPHQL_CLIENT_TOKEN } from "@comity/graphql-client";
import { DefaultHtmlLayoutCollector } from "@comity/html";
import { I18N_TOKEN } from "@comity/i18n";
import { htmlRenderer } from "../config/renderers.js";
import { presentCategory } from "../features/catalog/presenters/category.js";
import { categoryResolver } from "../features/catalog/resolvers/category.js";
import { GetCategory } from "../features/catalog/use-cases/get-category.js";
import { presentError } from "../features/error/presenters/html.js";
import { errorResolver } from "../features/error/resolvers/default.js";
import { CachedCategoryRepository } from "../magento/repositories/cached-category.js";
import { GraphqlCategoryRepository } from "../magento/repositories/category.js";

const route: Route<{}, CacheModuleServices & GraphqlClientModuleServices & I18nModuleServices> = {
  method: "GET",
  path: "/category",
  handler: async (ctx) => {
    const cache = ctx.services.resolve(CACHE_TOKEN);
    // Todo: FPC, Auth token
    const graphqlClient = ctx.services.resolve(GRAPHQL_CLIENT_TOKEN);
    const i18n = ctx.services.resolve(I18N_TOKEN);
    const liveRepository = new GraphqlCategoryRepository(graphqlClient);
    const cachedRepository = new CachedCategoryRepository(liveRepository, cache);
    const result = await new GetCategory(cachedRepository).execute("MjA=", {
      scope: "category-view",
    });
    const collector = new DefaultHtmlLayoutCollector();
    const locale = await i18n.resolveLocale("en-US");
    const translator = await i18n.getTranslator(locale.code);
    const contract = result.success
      ? presentCategory(result, translator)
      : presentError(result.error, translator);
    const resolved = await resolveContract(contract, { html: collector }, [
      errorResolver,
      categoryResolver,
    ]);
    const status = resolved.http?.status ?? 200;
    const headers = resolved.http?.headers ?? {};
    const view = resolved.view as ReactElement;

    if (!view) {
      return {
        status: 500,
        body: "No view",
      };
    }

    const output = await htmlRenderer.render(view, collector, {
      status,
      headers,
    });

    if (output.ok) {
      return output.value;
    }

    return {
      status: 500,
      body: "Render failed",
    };
  },
};

export default route;
