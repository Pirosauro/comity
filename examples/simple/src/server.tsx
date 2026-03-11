import { CompositeAssuranceEvaluator } from "@comity/auth";
import authJose from "@comity/auth-jose/setup";
import auth from "@comity/auth/setup";
import { load, ModuleMeta } from "@comity/composition";
import { HTTP_HONO_TOKEN } from "@comity/http-hono";
import httpHono from "@comity/http-hono/setup";
import http from "@comity/http/setup";
import { Kernel } from "@comity/kernel";
import { DefaultDiContainer } from "@comity/primitives/di";
import { DefaultEventBus, DefaultHookBus } from "@comity/primitives/lifecycle";
import router from "@comity/router/setup";
import { Hono } from "hono";
import apiHelloRoute from "./routes/api.get.js";
import homeRoute from "./routes/index.get.js";
import { InMemoryAuthSessionRepository } from "./temporary/auth-session-repository";
import { MemoryRouter } from "./temporary/memory-router.js";
import { slugRewriter } from "./temporary/slug-rewriter.js";

/* ───────────────── Kernel setup ───────────────── */

const kernel = new Kernel({
  services: new DefaultDiContainer(),
  events: new DefaultEventBus(),
  hooks: new DefaultHookBus(),
});

/* ───────────────── Routing ───────────────── */

const memoryRouter = new MemoryRouter([homeRoute, apiHelloRoute]);

/* ───────────────── Module loading ───────────────── */

const modules = [auth, authJose, http, httpHono, router] as ModuleMeta[];

try {
  await load(kernel, modules, {
    "@comity/http": {},

    "@comity/http-hono": {},

    "@comity/auth": {
      repository: new InMemoryAuthSessionRepository(),
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
      rewriters: [slugRewriter],
      policies: {},
    },
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}

const app = kernel.services.resolve(HTTP_HONO_TOKEN) as Hono;

export default app;
