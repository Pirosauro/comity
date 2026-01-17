import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHydrationRuntime, registerIslandElement } from "../bootstrap.js";
import type { HydrationContext } from "../context.js";

// Mock customElements
const mockCustomElements = {
  get: vi.fn(),
  define: vi.fn(),
};
vi.stubGlobal("customElements", mockCustomElements);
vi.mock("../element.js", () => ({
  ComityIslandElement: class MockComityIslandElement {},
}));

vi.mock("../hydrate.js", () => ({
  hydrateIslands: vi.fn(),
}));

describe("registerIslandElement", () => {
  beforeEach(() => {
    // Reset customElements registry
    mockCustomElements.get.mockReturnValue(undefined);
    mockCustomElements.define.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should define the comity-island custom element if not already defined", () => {
    const defineSpy = vi.spyOn(customElements, "define");

    registerIslandElement();

    expect(mockCustomElements.define).toHaveBeenCalledWith("comity-island", expect.any(Function));
  });

  it("should not define the element if already defined", () => {
    mockCustomElements.get.mockReturnValue({} as any); // Simulate already defined

    registerIslandElement();

    expect(mockCustomElements.get).toHaveBeenCalledWith("comity-island");
    expect(mockCustomElements.define).not.toHaveBeenCalled();
  });
});

describe("createHydrationRuntime", () => {
  let mockCtx: HydrationContext;

  beforeEach(() => {
    // Reset customElements registry
    mockCustomElements.get.mockReturnValue(undefined);
    mockCustomElements.define.mockClear();

    mockCtx = {
      events: {
        emit: vi.fn(),
      },
      registry: {
        get: vi.fn(),
        register: vi.fn(),
        list: vi.fn(),
        clear: vi.fn(),
      },
    } as any;

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should register the island element", () => {
    createHydrationRuntime(mockCtx);

    expect(mockCustomElements.define).toHaveBeenCalledWith("comity-island", expect.any(Function));
  });

  it("should return an object with a start method", () => {
    const runtime = createHydrationRuntime(mockCtx);

    expect(runtime).toHaveProperty("start");
    expect(typeof runtime.start).toBe("function");
  });

  it("should call hydrateIslands when start is called", async () => {
    const { hydrateIslands } = await import("../hydrate.js");

    const runtime = createHydrationRuntime(mockCtx);
    runtime.start();

    expect(hydrateIslands).toHaveBeenCalledWith(mockCtx);
  });
});