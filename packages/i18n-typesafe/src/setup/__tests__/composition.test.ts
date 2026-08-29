import type { ModuleSetupContext } from "@comity/composition/setup";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import composition from "../composition.js";

describe("i18n-typesafe module setup", () => {
  let ctx: ModuleSetupContext;

  beforeEach(() => {
    ctx = {
      services: { define: vi.fn(), resolve: vi.fn() },
      events: {},
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;
  });

  it("should succeed and define the configuring hook", async () => {
    const loadLocaleAsync = vi.fn(async () => ({}));
    const createI18n = vi.fn(() => ({ t: () => "" }));

    const result = await composition.setup(ctx, { loadLocaleAsync, createI18n });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();
      expect(init.success).toBe(true);
    }
  });

  it("should fail when the async loader is missing", async () => {
    const result = await composition.setup(ctx, { createI18n: vi.fn() } as never);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatchObject({
        code: "composition:setup_failed",
        meta: {
          details: { module: "@comity/i18n-typesafe", violation: "missing_loader" },
        },
      });
    }
  });

  it("should fail when the i18n factory is missing", async () => {
    const result = await composition.setup(ctx, { loadLocaleAsync: vi.fn() } as never);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toMatchObject({
        code: "composition:setup_failed",
        meta: {
          details: { module: "@comity/i18n-typesafe", violation: "missing_translator" },
        },
      });
    }
  });

  it("should wire the loader and factory into the i18n configuring hook", async () => {
    const loadLocaleAsync = vi.fn(async () => ({ greeting: "Ciao" }));
    const createI18n = vi.fn(() => ({ t: () => "" }));
    const hooks = new DefaultHookBus<any>();

    const wiredCtx = {
      services: { define: vi.fn(), resolve: vi.fn() },
      events: {},
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await composition.setup(wiredCtx, { loadLocaleAsync, createI18n });

    expect(result.success).toBe(true);

    const config = await hooks.execute("@comity/i18n:configuring", {});

    expect(config).toMatchObject({
      loader: expect.objectContaining({ load: expect.any(Function) }),
      factory: expect.any(Function),
    });
  });
});