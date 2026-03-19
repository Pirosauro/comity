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
import { Kernel } from "@comity/kernel";
import { DefaultDiContainer } from "@comity/primitives/di";
import { DefaultEventBus, DefaultHookBus } from "@comity/primitives/lifecycle";
import { MemoryRouter } from "@comity/router/routers";
import router from "@comity/router/setup";
import { Hono } from "hono";
import transport from "./config/graphql.js";
import categoryRoute from "./routes/category.get.js";
import homeRoute from "./routes/index.get.js";

/* ───────────────── Kernel setup ───────────────── */

const kernel = new Kernel({
  services: new DefaultDiContainer(),
  events: new DefaultEventBus(),
  hooks: new DefaultHookBus(),
});

/* ───────────────── Routing ───────────────── */

const memoryRouter = new MemoryRouter([homeRoute, categoryRoute]);

/* ───────────────── Module loading ───────────────── */

const modules = [auth, authJose, http, httpHono, router, graphqlClient, cache] as ModuleMeta[];

try {
  await load(kernel, modules, {
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
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

const app = kernel.services.resolve(HTTP_HONO_TOKEN) as Hono;

export default app;
