import type { HttpContext } from "../../contracts/context.js";
import type { HttpRequest } from "../../contracts/request.js";
import type { HttpResponse } from "../../contracts/response.js";
import type { ModuleSetupContext } from "@comity/composition/setup";
import type { HttpModuleOptions } from "../types.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import { CompositionError } from "@comity/composition/errors";
import { HTTP_TOKEN } from "../constants.js";
import module from "../index.js";

function createRequest(): HttpRequest {
  return {
    id: "req-1",
    method: "GET",
    url: new URL("https://example.com/products"),
    headers: {},
    params: {},
    cookies: {},
  };
}

function createContext(events: Record<string, ReturnType<typeof vi.fn>>): HttpContext {
  return {
    request: createRequest(),
    signal: new AbortController().signal,
    state: {},
    services: { resolve: vi.fn() },
    events,
  } as unknown as HttpContext;
}

describe("http module setup", () => {
  let define: ReturnType<typeof vi.fn>;
  let resolve: ReturnType<typeof vi.fn>;
  let emit: ReturnType<typeof vi.fn>;
  let ctx: ModuleSetupContext;

  beforeEach(() => {
    define = vi.fn();
    resolve = vi.fn();
    emit = vi.fn();

    ctx = {
      services: { define, resolve },
      events: { emit },
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;
  });

  it("should fail when no HTTP handler is provided", async () => {
    const result = await module.setup(ctx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(false);
      if (!init.success) {
        expect(init.error).toBeInstanceOf(CompositionError);
        expect(init.error.meta?.reason).toBe("initialization_failed");
        expect(init.error.meta?.details?.module).toBe("@comity/http");
      }
    }
  });

  it("should succeed and define the HTTP facade service", async () => {
    const handler = vi.fn();
    const result = await module.setup(ctx, { handler });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(define).toHaveBeenCalledWith(HTTP_TOKEN, expect.any(Function));
    }
  });

  it("should let the configuring hook inject a missing handler", async () => {
    const handler = vi.fn();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/http:configuring", () => ({ handler }));

    const configuredCtx = {
      services: { define, resolve },
      events: { emit },
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(configuredCtx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();

      expect(define).toHaveBeenCalledWith(HTTP_TOKEN, expect.any(Function));
    }
  });

  it("should execute the initialized hook during init", async () => {
    const handler = vi.fn();
    const initialized = vi.fn();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/http:initialized", initialized);

    const hooksCtx = {
      services: { define, resolve },
      events: { emit },
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(hooksCtx, { handler });

    if (isSuccess(result)) {
      await result.value();

      expect(initialized).toHaveBeenCalled();
    }
  });

  it("should return a working facade from the service factory", async () => {
    const response: HttpResponse = { status: 200, body: "ok" };
    const handler = vi.fn().mockResolvedValue(response);
    const result = await module.setup(ctx, { handler });

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === HTTP_TOKEN)?.[1];
      const facade = factory?.();

      await expect(facade.handle(createContext({ emit }))).resolves.toBe(response);
    }
  });

  it("should emit request lifecycle events through the event bus", async () => {
    const response: HttpResponse = { status: 200, body: "ok" };
    const handler = vi.fn().mockResolvedValue(response);
    const result = await module.setup(ctx, { handler });

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === HTTP_TOKEN)?.[1];
      const facade = factory?.();

      await facade.handle(createContext({ emit }));

      expect(emit).toHaveBeenCalledWith(
        "@comity/http:request-started",
        expect.objectContaining({ id: "req-1" })
      );
      expect(emit).toHaveBeenCalledWith(
        "@comity/http:request-completed",
        expect.objectContaining({ request: expect.objectContaining({ id: "req-1" }) })
      );
    }
  });

  it("should apply configured middleware before the handler", async () => {
    const order: string[] = [];
    const middleware = vi.fn().mockImplementation(async (_ctx: HttpContext, next: () => Promise<HttpResponse>) => {
      order.push("middleware");
      const response = await next();
      order.push("after");
      return response;
    });
    const handler = vi.fn().mockImplementation(async () => {
      order.push("handler");
      return { status: 200 };
    });

    const options: HttpModuleOptions = { middleware: [middleware], handler };
    const result = await module.setup(ctx, options);

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === HTTP_TOKEN)?.[1];
      const facade = factory?.();

      await facade.handle(createContext({ emit }));

      expect(order).toEqual(["middleware", "handler", "after"]);
    }
  });

  it("should emit request-failed when the handler throws", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("boom"));
    const result = await module.setup(ctx, { handler });

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === HTTP_TOKEN)?.[1];
      const facade = factory?.();

      await expect(facade.handle(createContext({ emit }))).rejects.toThrow("boom");

      expect(emit).toHaveBeenCalledWith(
        "@comity/http:request-failed",
        expect.objectContaining({ error: expect.objectContaining({ message: "boom" }) })
      );
    }
  });
});