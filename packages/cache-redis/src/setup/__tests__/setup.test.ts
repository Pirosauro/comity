import type { ModuleSetupContext } from "@comity/composition/setup";

import { describe, expect, it, vi } from "vitest";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import module from "../index.js";
import { RedisCacheStore } from "../../store.js";

function createContext() {
  const hooks = new DefaultHookBus<any>();
  const ctx = {
    services: { define: vi.fn() },
    events: {},
    hooks,
  } as unknown as ModuleSetupContext;

  return { ctx, hooks };
}

describe("cache-redis module setup", () => {
  it("should succeed even without a client", async () => {
    const { ctx } = createContext();

    const result = await module.setup(ctx, undefined);

    expect(result.success).toBe(true);
  });

  it("should define the configuring hook when a client is provided", async () => {
    const client = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    };
    const { ctx, hooks } = createContext();

    const result = await module.setup(ctx, { client: client as any });

    expect(result.success).toBe(true);

    const cfg = await hooks.execute("@comity/cache:configuring", {});

    expect(cfg.store).toBeInstanceOf(RedisCacheStore);
  });
});