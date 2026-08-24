import type { ModuleSetupContext } from "@comity/composition/setup";

import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";

import { describe, expect, it, vi } from "vitest";
import { module } from "../index.js";

describe("catalog module setup", () => {
  it("should expose module metadata", () => {
    expect(module.name).toBe("@comity/catalog");
    expect(module.version).toBe("0.1.0");
    expect(module.dependsOn).toEqual({});
  });

  it("should succeed with a no-op initializer", async () => {
    const ctx = {
      services: { define: vi.fn(), resolve: vi.fn() },
      events: {},
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;

    const result = await module.setup(ctx, undefined);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();
      expect(isSuccess(init)).toBe(true);
    }
  });
});