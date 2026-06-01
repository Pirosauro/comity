import type { HttpHonoModuleServices } from "@comity/http-hono";
import type { I18nModuleOptions } from "@comity/i18n";

import { CompositeAssuranceEvaluator } from "@comity/auth";
import authJose from "@comity/auth-jose/setup";
import { MemoryAuthSessionRepository } from "@comity/auth/repositories";
import auth from "@comity/auth/setup";
import cache from "@comity/cache/setup";
import { MemoryCacheStore } from "@comity/cache/stores";
import { load, ModuleMeta } from "@comity/composition";
import graphqlClient from "@comity/graphql-client/setup";
import { HTTP_HONO_TOKEN } from "@comity/http-hono";
import httpHono from "@comity/http-hono/setup";
import http from "@comity/http/setup";
import i18n from "@comity/i18n/setup";
import { Kernel } from "@comity/kernel";
import { DefaultDiContainer } from "@comity/primitives/di";
import { toSafePayload } from "@comity/primitives/error";
import { DefaultEventBus, DefaultHookBus } from "@comity/primitives/lifecycle";
import { MemoryRouter } from "@comity/router/routers";
import router from "@comity/router/setup";
import transport from "./config/graphql.js";
import apiProductsRoute from "./routes/api/products.get.js";
import categoryRoute from "./routes/category.get.js";

/* ───────────────── Kernel setup ───────────────── */

const kernel = new Kernel<HttpHonoModuleServices>({
  services: new DefaultDiContainer(),
  events: new DefaultEventBus(),
  hooks: new DefaultHookBus(),
});

/* ───────────────── Routing ───────────────── */

const memoryRouter = new MemoryRouter([categoryRoute, apiProductsRoute]);

/* ───────────────── Module loading ───────────────── */

const modules = [
  auth,
  authJose,
  http,
  httpHono,
  router,
  graphqlClient,
  cache,
  i18n,
] as ModuleMeta[];

const i18nMock: I18nModuleOptions = {
  loader: {
    load: async (locale: string) => Promise.resolve({} as Record<string, unknown>),
  },
  factory: (locale: string, resources: Record<string, any>) => {
    return {
      get locale() {
        return locale;
      },
      t: (key: string) => key,
    };
  },
};

const result = await load(kernel, modules, {
  "@comity/http": {},

  "@comity/http-hono": {},

  "@comity/auth": {
    repository: new MemoryAuthSessionRepository(),
    evaluator: new CompositeAssuranceEvaluator([]),
  },

  "@comity/auth-jose": {
    secret: "dev-secret",
    issuer: "comity-example",
    accessKey: "supersecret",
    refreshKey: "supersecret",
  },

  "@comity/router": {
    routers: [memoryRouter],
    rewriters: [],
    policies: {},
  },

  "@comity/graphql-client": {
    transport,
  },

  "@comity/cache": {
    store: new MemoryCacheStore(),
  },

  "@comity/i18n": i18nMock,
});

if (!result.success) {
  console.error(toSafePayload(result.error));
  process.exit(1);
}

const app = kernel.services.resolve(HTTP_HONO_TOKEN);

export default app;
