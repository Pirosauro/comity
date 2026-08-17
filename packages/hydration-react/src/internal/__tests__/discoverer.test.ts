import type { IslandElement } from "@comity/hydration/client";

import { describe, expect, it, vi } from "vitest";
import { DomIslandDiscoveryAdapter } from "../discoverer.js";

describe("DomIslandDiscoveryAdapter", () => {
  it("discovers all comity-island elements on attach", () => {
    const islandA = {} as IslandElement;
    const islandB = {} as IslandElement;
    const root = {
      querySelectorAll: vi.fn().mockReturnValue([islandA, islandB]),
    };
    const onDiscovered = vi.fn();
    const adapter = new DomIslandDiscoveryAdapter(root as unknown as ParentNode, onDiscovered);

    adapter.attach();

    expect(root.querySelectorAll).toHaveBeenCalledWith("comity-island");
    expect(onDiscovered).toHaveBeenCalledTimes(2);
    expect(onDiscovered).toHaveBeenNthCalledWith(1, islandA);
    expect(onDiscovered).toHaveBeenNthCalledWith(2, islandB);
  });

  it("does not call onDiscovered when no islands exist", () => {
    const root = {
      querySelectorAll: vi.fn().mockReturnValue([]),
    };
    const onDiscovered = vi.fn();
    const adapter = new DomIslandDiscoveryAdapter(root as unknown as ParentNode, onDiscovered);

    adapter.attach();

    expect(onDiscovered).not.toHaveBeenCalled();
  });

  it("detach is a no-op", () => {
    const root = {
      querySelectorAll: vi.fn().mockReturnValue([]),
    };
    const adapter = new DomIslandDiscoveryAdapter(
      root as unknown as ParentNode,
      () => {}
    );

    expect(() => adapter.detach()).not.toThrow();
  });
});