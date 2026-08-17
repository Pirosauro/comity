import type { IslandContract } from "@comity/hydration";
import type { IslandElement } from "@comity/hydration/client";
import type { IslandComponentRegistry } from "../contracts/registry.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReactIslandHydrationAdapter } from "../hydrator.js";

const createRootMock = vi.hoisted(() => vi.fn());
const hydrateRootMock = vi.hoisted(() => vi.fn());

vi.mock("react-dom/client", () => ({
  createRoot: createRootMock,
  hydrateRoot: hydrateRootMock,
}));

describe("ReactIslandHydrationAdapter", () => {
  beforeEach(() => {
    createRootMock.mockReset();
    hydrateRootMock.mockReset();
    createRootMock.mockReturnValue({ render: vi.fn() });
  });

  const registry: IslandComponentRegistry = {
    Hero: vi.fn().mockResolvedValue({ default: () => null }),
  };

  function islandElement() {
    return { querySelector: vi.fn().mockReturnValue(null) } as unknown as IslandElement;
  }

  it("supports contracts with a component", () => {
    const adapter = new ReactIslandHydrationAdapter(registry);

    expect(
      adapter.supports({ component: "Hero" } as IslandContract)
    ).toBe(true);
  });

  it("does not support contracts without a component", () => {
    const adapter = new ReactIslandHydrationAdapter(registry);

    expect(adapter.supports({} as IslandContract)).toBe(false);
  });

  it("throws not_registered when the component loader is missing", async () => {
    const adapter = new ReactIslandHydrationAdapter(registry);
    const island = islandElement();
    const contract = { component: "Missing" } as IslandContract;

    await expect(adapter.hydrate(island, contract)).rejects.toMatchObject({
      code: "hydration:not_registered",
    });
  });

  it("throws invalid_component when the loader has no default export", async () => {
    const adapter = new ReactIslandHydrationAdapter({
      Broken: vi.fn().mockResolvedValue({}),
    });
    const island = islandElement();
    const contract = { component: "Broken" } as IslandContract;

    await expect(adapter.hydrate(island, contract)).rejects.toMatchObject({
      code: "hydration:invalid_component",
    });
  });

  it("renders client-only islands via createRoot", async () => {
    const adapter = new ReactIslandHydrationAdapter(registry);
    const island = islandElement();
    const contract = {
      component: "Hero",
      data: { title: "Hello" },
      mode: "client-only",
    } as IslandContract;

    await adapter.hydrate(island, contract);

    expect(createRootMock).toHaveBeenCalledWith(island);
    expect(hydrateRootMock).not.toHaveBeenCalled();
  });

  it("hydrates SSR islands via hydrateRoot", async () => {
    const adapter = new ReactIslandHydrationAdapter(registry);
    const island = islandElement();
    const contract = {
      component: "Hero",
      data: { title: "Hello" },
    } as IslandContract;

    await adapter.hydrate(island, contract);

    expect(hydrateRootMock).toHaveBeenCalledTimes(1);
    expect(createRootMock).not.toHaveBeenCalled();
  });
});