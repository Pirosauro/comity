import type { IslandContract } from "@comity/hydration";
import type { IslandElement } from "@comity/hydration/client";
import type { IslandComponentRegistry } from "../contracts/registry.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { PreactIslandHydrationAdapter } from "../hydrator.js";

const hydrateMock = vi.hoisted(() => vi.fn());
const renderMock = vi.hoisted(() => vi.fn());

vi.mock("preact", async (importOriginal) => {
  const actual = await importOriginal<typeof import("preact")>();

  return {
    ...actual,
    render: renderMock,
    hydrate: hydrateMock,
  };
});

describe("PreactIslandHydrationAdapter", () => {
  beforeEach(() => {
    renderMock.mockClear();
    hydrateMock.mockClear();
  });
  const registry: IslandComponentRegistry = {
    Hero: vi.fn().mockResolvedValue({ default: () => null }),
  };

  function islandElement() {
    return { querySelector: vi.fn().mockReturnValue(null) } as unknown as IslandElement;
  }

  it("supports contracts with a component", () => {
    const adapter = new PreactIslandHydrationAdapter(registry);

    expect(
      adapter.supports({ component: "Hero" } as IslandContract)
    ).toBe(true);
  });

  it("does not support contracts without a component", () => {
    const adapter = new PreactIslandHydrationAdapter(registry);

    expect(adapter.supports({} as IslandContract)).toBe(false);
  });

  it("throws not_registered when the component loader is missing", async () => {
    const adapter = new PreactIslandHydrationAdapter(registry);
    const island = islandElement();
    const contract = { component: "Missing" } as IslandContract;

    await expect(adapter.hydrate(island, contract)).rejects.toMatchObject({
      code: "hydration:not_registered",
    });
  });

  it("throws invalid_component when the loader has no default export", async () => {
    const adapter = new PreactIslandHydrationAdapter({
      Broken: vi.fn().mockResolvedValue({}),
    });
    const island = islandElement();
    const contract = { component: "Broken" } as IslandContract;

    await expect(adapter.hydrate(island, contract)).rejects.toMatchObject({
      code: "hydration:invalid_component",
    });
  });

  it("renders client-only islands into the mount target", async () => {
    const adapter = new PreactIslandHydrationAdapter(registry);
    const island = islandElement();
    const contract = {
      component: "Hero",
      data: { title: "Hello" },
      mode: "client-only",
    } as IslandContract;

    await adapter.hydrate(island, contract);

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(hydrateMock).not.toHaveBeenCalled();
  });

  it("hydrates SSR islands into the mount target", async () => {
    const adapter = new PreactIslandHydrationAdapter(registry);
    const island = islandElement();
    const contract = {
      component: "Hero",
      data: { title: "Hello" },
    } as IslandContract;

    await adapter.hydrate(island, contract);

    expect(hydrateMock).toHaveBeenCalledTimes(1);
    expect(renderMock).not.toHaveBeenCalled();
  });

  it("mounts into the data-comity-root child when present", async () => {
    const mountTarget = {} as Element;
    const adapter = new PreactIslandHydrationAdapter(registry);
    const island = {
      querySelector: vi.fn().mockReturnValue(mountTarget),
    } as unknown as IslandElement;
    const contract = {
      component: "Hero",
      data: {},
      mode: "client-only",
    } as IslandContract;

    await adapter.hydrate(island, contract);

    expect(renderMock).toHaveBeenCalledWith(expect.anything(), mountTarget);
  });
});