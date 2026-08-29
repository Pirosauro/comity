import type { ModuleSetupContext } from "@comity/composition/setup";

import { DefaultHookBus } from "@comity/primitives/lifecycle";
import { isSuccess } from "@comity/primitives/result";

import { describe, expect, it, vi } from "vitest";
import composition from "../composition.js";

describe("catalog module setup", () => {
  it("should expose module metadata", () => {
    expect(composition.name).toBe("@comity/catalog");
    expect(composition.version).toBe("0.1.0");
    expect(composition.dependsOn).toEqual({});
  });

  it("should succeed with a no-op initializer", async () => {
    const ctx = {
      services: { define: vi.fn(), resolve: vi.fn() },
      events: {},
      hooks: new DefaultHookBus<any>(),
    } as unknown as ModuleSetupContext;

    const result = await composition.setup(ctx, undefined);

    expect(isSuccess(result)).toBe(true);
    if (isSuccess(result)) {
      const init = await result.value();
      expect(isSuccess(init)).toBe(true);
    }
  });
});