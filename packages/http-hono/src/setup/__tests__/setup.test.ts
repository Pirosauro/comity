import type { ModuleSetupContext } from "@comity/composition/setup";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import { HttpFacade } from "@comity/http";
import { HTTP_TOKEN } from "@comity/http/setup";
import { HTTP_HONO_TOKEN } from "../constants.js";
import module from "../index.js";

describe("http-hono module setup", () => {
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

  it("should succeed and define the Hono instance service", async () => {
    const facade = new HttpFacade(vi.fn().mockResolvedValue({ status: 200 }));
    resolve.mockReturnValue(facade);

    const result = await module.setup(ctx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(resolve).toHaveBeenCalledWith(HTTP_TOKEN);
      expect(define).toHaveBeenCalledWith(HTTP_HONO_TOKEN, expect.any(Function));
    }
  });

  it("should return a Hono instance from the service factory", async () => {
    const facade = new HttpFacade(vi.fn().mockResolvedValue({ status: 200 }));
    resolve.mockReturnValue(facade);

    const result = await module.setup(ctx, {});

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === HTTP_HONO_TOKEN)?.[1];
      const hono = factory?.();

      expect(typeof hono.request).toBe("function");
    }
  });

  it("should route requests through the resolved HTTP facade", async () => {
    const handler = vi.fn().mockResolvedValue({ status: 200, body: "ok" });
    const facade = new HttpFacade(handler);
    resolve.mockReturnValue(facade);

    const result = await module.setup(ctx, {});

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls.find((c) => c[0] === HTTP_HONO_TOKEN)?.[1];
      const hono = factory?.();

      const response = await hono.request("http://localhost/products");

      expect(handler).toHaveBeenCalled();
      expect(response.status).toBe(200);
      await expect(response.text()).resolves.toBe("ok");
    }
  });

  it("should let the configuring hook adjust Hono options", async () => {
    const facade = new HttpFacade(vi.fn().mockResolvedValue({ status: 200 }));
    resolve.mockReturnValue(facade);
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/http-hono:configuring", () => ({ strict: false }));

    const configuredCtx = {
      services: { define, resolve },
      events: { emit },
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(configuredCtx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();

      expect(define).toHaveBeenCalledWith(HTTP_HONO_TOKEN, expect.any(Function));
    }
  });

  it("should execute the initialized hook during init", async () => {
    const facade = new HttpFacade(vi.fn().mockResolvedValue({ status: 200 }));
    resolve.mockReturnValue(facade);
    const initialized = vi.fn();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/http-hono:initialized", initialized);

    const hooksCtx = {
      services: { define, resolve },
      events: { emit },
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(hooksCtx, {});

    if (isSuccess(result)) {
      await result.value();

      expect(initialized).toHaveBeenCalled();
    }
  });
});