import type { ModuleSetupContext } from "@comity/composition/setup";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import { I18N_TOKEN, module } from "../index.js";

describe("i18n module setup", () => {
  let define: ReturnType<typeof vi.fn>;
  let ctx: ModuleSetupContext;

  beforeEach(() => {
    define = vi.fn();

    ctx = {
      services: { define, resolve: vi.fn() },
      events: {},
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;
  });

  it("should succeed and define the i18n service", async () => {
    const result = await module.setup(ctx, {
      loader: { load: vi.fn() },
      factory: vi.fn(),
    });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(define).toHaveBeenCalledWith(I18N_TOKEN, expect.any(Function));
    }
  });

  it("should fail when no loader is configured", async () => {
    const result = await module.setup(ctx, { factory: vi.fn() });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(false);
      if (!init.success) {
        expect(init.error).toMatchObject({
          code: "composition:initialization_failed",
          meta: {
            details: { module: "@comity/i18n", violation: "missing_loader" },
          },
        });
      }
    }
  });

  it("should fail when no translator factory is configured", async () => {
    const result = await module.setup(ctx, { loader: { load: vi.fn() } });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(false);
      if (!init.success) {
        expect(init.error).toMatchObject({
          code: "composition:initialization_failed",
          meta: {
            details: { module: "@comity/i18n", violation: "missing_translator" },
          },
        });
      }
    }
  });

  it("should apply the configuring hook to the initial options", async () => {
    const loader = { load: vi.fn() };
    const factory = vi.fn();
    const hooks = new DefaultHookBus<any>();

    hooks.define("@comity/i18n:configuring", (cfg: unknown) => ({ ...(cfg as object) }));

    const configuredCtx = {
      services: { define, resolve: vi.fn() },
      events: {},
      hooks,
    } as unknown as ModuleSetupContext;

    const result = await module.setup(configuredCtx, { loader, factory });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();
      expect(define).toHaveBeenCalledWith(I18N_TOKEN, expect.any(Function));
    }
  });
});