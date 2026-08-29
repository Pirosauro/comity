import type { Router, RouteResolutionContext } from "../../contracts/router.js";
import type { HttpContext, HttpResponse } from "@comity/http";
import type { ModuleSetupContext } from "@comity/composition/setup";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import composition from "../composition.js";

function createContext(): HttpContext {
  return {
    request: {
      id: "req-1",
      method: "GET",
      url: new URL("https://example.com/products"),
      headers: {},
      params: {},
      cookies: {},
    },
    signal: new AbortController().signal,
    state: {},
    services: { resolve: vi.fn() },
    events: {},
  } as unknown as HttpContext;
}

describe("router module setup", () => {
  let define: ReturnType<typeof vi.fn>;
  let resolve: ReturnType<typeof vi.fn>;
  let ctx: ModuleSetupContext;

  beforeEach(() => {
    define = vi.fn();
    resolve = vi.fn();

    ctx = {
      services: { define, resolve },
      events: {},
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;
  });

  it("should succeed with default configuration", async () => {
    const result = await composition.setup(ctx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
    }
  });

  it("should register an http:configuring hook that provides a router handler", async () => {
    const result = await composition.setup(ctx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();

      const configured = await ctx.hooks.execute(
        "@comity/http:configuring" as never,
        {} as never
      );

      expect(configured).toMatchObject({ handler: expect.any(Function) });
    }
  });

  it("should route requests through the configured routers", async () => {
    const routeHandler = vi.fn().mockResolvedValue({ status: 200, body: "from-route" } satisfies HttpResponse);
    const router: Router = {
      match: vi.fn().mockResolvedValue({
        route: { handler: routeHandler },
        params: { id: "42" },
      }),
    };

    const result = await composition.setup(ctx, { routers: [router] });

    if (isSuccess(result)) {
      await result.value();

      const configured = (await ctx.hooks.execute(
        "@comity/http:configuring" as never,
        {} as never
      )) as { handler: (c: HttpContext) => Promise<HttpResponse> };

      const response = await configured.handler(createContext());

      expect(router.match).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.any(URL) })
      );
      expect(routeHandler).toHaveBeenCalled();
      expect(response).toEqual({ status: 200, body: "from-route" });
    }
  });

  it("should return 404 when no router matches", async () => {
    const router: Router = {
      match: vi.fn().mockResolvedValue(null),
    };

    const result = await composition.setup(ctx, { routers: [router] });

    if (isSuccess(result)) {
      await result.value();

      const configured = (await ctx.hooks.execute(
        "@comity/http:configuring" as never,
        {} as never
      )) as { handler: (c: HttpContext) => Promise<HttpResponse> };

      const response = await configured.handler(createContext());

      expect(response.status).toBe(404);
    }
  });

  it("should apply URL rewriters before matching", async () => {
    const router: Router = {
      match: vi.fn().mockResolvedValue({
        route: { handler: vi.fn().mockResolvedValue({ status: 200 }) },
      }),
    };
    const rewriter = {
      rewrite: vi.fn().mockResolvedValue(new URL("https://example.com/rewritten")),
    };

    const result = await composition.setup(ctx, { routers: [router], rewriters: [rewriter] });

    if (isSuccess(result)) {
      await result.value();

      const configured = (await ctx.hooks.execute(
        "@comity/http:configuring" as never,
        {} as never
      )) as { handler: (c: HttpContext) => Promise<HttpResponse> };

      await configured.handler(createContext());

      expect(router.match).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.any(URL) })
      );
      expect(rewriter.rewrite).toHaveBeenCalled();
    }
  });

  it("should let the configuring hook inject routers", async () => {
    const router: Router = {
      match: vi.fn().mockResolvedValue(null),
    };
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/router:configuring", () => ({ routers: [router] }));

    const configuredCtx = {
      services: { define, resolve },
      events: {},
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await composition.setup(configuredCtx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();

      const configured = (await configuredCtx.hooks.execute(
        "@comity/http:configuring" as never,
        {} as never
      )) as { handler: (c: HttpContext) => Promise<HttpResponse> };

      await configured.handler(createContext());

      expect(router.match).toHaveBeenCalled();
    }
  });

  it("should execute the initialized hook during init", async () => {
    const initialized = vi.fn();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/router:initialized", initialized);

    const hooksCtx = {
      services: { define, resolve },
      events: {},
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await composition.setup(hooksCtx, {});

    if (isSuccess(result)) {
      await result.value();

      expect(initialized).toHaveBeenCalled();
    }
  });
});