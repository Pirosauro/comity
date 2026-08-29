import type { ModuleSetupContext } from "@comity/composition/setup";

import { describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import composition from "../composition.js";
import { KvCacheStore } from "../../store.js";

function createContext() {
  const hooks = new DefaultHookBus<any>();
  const ctx = {
    services: { define: vi.fn() },
    events: {},
    hooks,
  } as unknown as ModuleSetupContext;

  return { ctx, hooks };
}

describe("cache-kv module setup", () => {
  it("should succeed even without a namespace", async () => {
    const { ctx } = createContext();

    const result = await composition.setup(ctx, undefined);

    expect(result.success).toBe(true);
  });

  it("should define the configuring hook when a namespace is provided", async () => {
    const ns = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    const { ctx, hooks } = createContext();

    const result = await composition.setup(ctx, { ns: ns as any });

    expect(result.success).toBe(true);

    const cfg = await hooks.execute("@comity/cache:configuring", {});

    expect(cfg.store).toBeInstanceOf(KvCacheStore);
  });
});