import type { IslandElement } from "@comity/hydration/client";
import type { IslandComponentRegistry } from "../contracts/registry.js";

import { describe, expect, it, vi } from "vitest";
import { createHydrationRuntime } from "../hydration.js";

describe("createHydrationRuntime", () => {
  it("attaches discovery and finds no islands in an empty root", () => {
    const root = {
      querySelectorAll: vi.fn().mockReturnValue([]),
    };
    const islands: IslandComponentRegistry = {};

    expect(() => createHydrationRuntime({ root: root as ParentNode, islands })).not.toThrow();

    expect(root.querySelectorAll).toHaveBeenCalledWith("comity-island");
  });

  it("dispatches discovered islands to the controller", () => {
    const island = {} as IslandElement;
    const root = {
      querySelectorAll: vi.fn().mockReturnValue([island]),
    };
    const islands: IslandComponentRegistry = {};
    const observer = {
      onIslandDiscovered: vi.fn(),
      onIslandScheduled: vi.fn(),
      onIslandHydrationStarted: vi.fn(),
      onIslandHydrationCompleted: vi.fn(),
      onIslandHydrationFailed: vi.fn(),
    };

    createHydrationRuntime({
      root: root as ParentNode,
      islands,
      observer,
    });

    expect(observer.onIslandHydrationFailed).toHaveBeenCalledWith({
      reason: "invalid_contract",
      duration: 0,
    });
  });
});