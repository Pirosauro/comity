import type { ModuleSetupContext } from "@comity/composition/setup";

import { describe, expect, it, vi } from "vitest";
import { CompositionError } from "@comity/composition/errors";
import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";
import { STORAGE_TOKEN } from "../constants.js";
import { module } from "../index.js";
import { MemoryStorageStore } from "../../stores/memory.js";

function createContext() {
  const hooks = new DefaultHookBus<any>();
  const define = vi.fn();

  const ctx = {
    services: { define },
    events: {},
    hooks,
  } as unknown as ModuleSetupContext;

  return { ctx, define };
}

describe("storage module setup", () => {
  it("should fail when no store is configured", async () => {
    const { ctx } = createContext();

    const result = await module.setup(ctx, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(CompositionError);
      expect(result.error.meta.reason).toBe("setup_failed");
      expect(result.error.meta.details?.violation).toBe("missing_store");
    }
  });

  it("should define the storage service when a store is configured", async () => {
    const store = new MemoryStorageStore();
    const { ctx, define } = createContext();

    const result = await module.setup(ctx, { store });

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();

      expect(init.success).toBe(true);
      expect(define).toHaveBeenCalledWith(STORAGE_TOKEN, expect.any(Function));
    }
  });

  it("should allow the configuring hook to inject a store", async () => {
    const store = new MemoryStorageStore();
    const { ctx, define } = createContext();

    ctx.hooks.define("@comity/storage:configuring", (cfg) => ({ ...cfg, store }));

    const result = await module.setup(ctx, {});

    expect(result.success).toBe(true);
    if (isSuccess(result)) {
      await result.value();

      expect(define).toHaveBeenCalledWith(STORAGE_TOKEN, expect.any(Function));
    }
  });

  it("should expose a working storage facade through the service factory", async () => {
    const store = new MemoryStorageStore();
    const { ctx, define } = createContext();

    const result = await module.setup(ctx, { store });

    if (isSuccess(result)) {
      await result.value();

      const factory = define.mock.calls[0][1];

      expect(typeof factory().put).toBe("function");
      expect(typeof factory().get).toBe("function");
    }
  });
});