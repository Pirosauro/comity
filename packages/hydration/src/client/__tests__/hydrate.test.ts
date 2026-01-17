// @vitest-environment jsdom
import type { HydrationContext } from "../context.js";
import type { ComityIslandElement } from "../element.js";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hydrateIslands } from "../hydrate.js";

// Mock document
const mockQuerySelectorAll = vi.fn();
vi.stubGlobal("document", {
  querySelectorAll: mockQuerySelectorAll,
});

// Mock performance
vi.stubGlobal("performance", {
  now: vi.fn(),
});
vi.mock("../strategies/immediate.js", () => ({
  immediate: vi.fn((run) => run()),
}));

vi.mock("../strategies/idle.js", () => ({
  idle: vi.fn(),
}));

vi.mock("../strategies/interaction.js", () => ({
  interaction: vi.fn(),
}));

vi.mock("../strategies/media.js", () => ({
  media: vi.fn(),
}));

vi.mock("../strategies/visible.js", () => ({
  visible: vi.fn(),
}));

describe("hydrateIslands", () => {
  let mockCtx: HydrationContext;
  let mockEvents: any;
  let mockRegistry: any;
  let mockElement: ComityIslandElement;

  beforeEach(() => {
    mockEvents = {
      emit: vi.fn(),
    };

    mockRegistry = {
      get: vi.fn(),
    };

    // @ts-expect-error
    mockCtx = {
      events: mockEvents,
      registry: mockRegistry,
    };

    // Create mock element
    // @ts-expect-error
    mockElement = {
      contract: {
        name: "test-island",
        data: { test: "data" },
        strategy: { type: "immediate" as const },
      },
      hydrated: 0,
    };

    // Mock document.querySelectorAll
    mockQuerySelectorAll.mockReturnValue([mockElement]);

    // Mock performance.now
    const mockPerformanceNow = vi.mocked(performance.now);
    mockPerformanceNow.mockReturnValue(1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("should emit hydration start event", async () => {
    mockRegistry.get.mockReturnValue(() => ({ default: vi.fn() }));

    await hydrateIslands(mockCtx);

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:start", undefined);
  });

  it("should emit scheduled event at the end", async () => {
    mockRegistry.get.mockReturnValue(() => ({ default: vi.fn() }));

    await hydrateIslands(mockCtx);

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:scheduled", undefined);
  });

  it("should query for comity-island elements", async () => {
    mockRegistry.get.mockReturnValue(() => ({ default: vi.fn() }));

    await hydrateIslands(mockCtx);

    expect(mockQuerySelectorAll).toHaveBeenCalledWith("comity-island");
  });

  it("should validate contract and emit error for invalid contract", async () => {
    // @ts-expect-error
    mockElement.contract = null;

    await hydrateIslands(mockCtx);

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_error", {
      reason: "invalid_contract",
      error: expect.any(Error),
    });
  });

  it("should emit error for missing name", async () => {
    // @ts-expect-error
    mockElement.contract = {
      data: {},
      strategy: { type: "immediate" as const },
    };

    await hydrateIslands(mockCtx);

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_error", {
      reason: "invalid_contract",
      error: expect.any(Error),
    });
  });

  it("should emit error for unregistered island", async () => {
    mockRegistry.get.mockReturnValue(undefined);

    await hydrateIslands(mockCtx);

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_error", {
      name: "test-island",
      strategy: { type: "immediate" },
      reason: "not_registered",
      error: expect.any(Error),
    });
  });

  it("should emit error for missing strategy", async () => {
    // @ts-expect-error
    mockElement.contract = {
      name: "test-island",
      data: {},
    };

    await hydrateIslands(mockCtx);

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_error", {
      reason: "invalid_contract",
      error: expect.any(Error),
    });
  });

  it("should emit error for invalid strategy object", async () => {
    // @ts-expect-error
    mockElement.contract = {
      name: "test-island",
      data: {},
      strategy: null,
    };

    await hydrateIslands(mockCtx);

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_error", {
      reason: "invalid_contract",
      error: expect.any(Error),
    });
  });

  it("should emit error for strategy without type", async () => {
    // @ts-expect-error
    mockElement.contract = {
      name: "test-island",
      data: {},
      strategy: {},
    };

    await hydrateIslands(mockCtx);

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_error", {
      reason: "invalid_contract",
      error: expect.any(Error),
    });
  });

  it("should call loader and hydrate function for valid island", async () => {
    const mockHydrate = vi.fn().mockResolvedValue(undefined);

    mockRegistry.get.mockReturnValue(() => ({ default: mockHydrate }));

    await hydrateIslands(mockCtx);

    expect(mockHydrate).toHaveBeenCalledWith({ test: "data" }, mockElement);
  });

  it("should emit island start and complete events", async () => {
    const mockHydrate = vi.fn().mockResolvedValue(undefined);

    mockRegistry.get.mockReturnValue(() => ({ default: mockHydrate }));

    await hydrateIslands(mockCtx);

    await vi.waitFor(() => {
      expect(mockEvents.emit).toHaveBeenCalledWith(
        "@comity/hydration:island_complete",
        expect.any(Object)
      );
    });

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_start", {
      name: "test-island",
      strategy: { type: "immediate" },
    });

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_complete", {
      name: "test-island",
      strategy: { type: "immediate" },
      success: true,
      duration: expect.any(Number),
    });
  });

  it("should emit error on hydration failure", async () => {
    const error = new Error("Hydration failed");
    const mockHydrate = vi.fn().mockRejectedValue(error);

    mockRegistry.get.mockReturnValue(() => ({ default: mockHydrate }));

    await hydrateIslands(mockCtx);

    await vi.waitFor(() => {
      expect(mockEvents.emit).toHaveBeenCalledWith(
        "@comity/hydration:island_error",
        expect.any(Object)
      );
    });

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_error", {
      name: "test-island",
      strategy: { type: "immediate" },
      reason: "hydrate_failed",
      error,
    });

    expect(mockEvents.emit).toHaveBeenCalledWith("@comity/hydration:island_complete", {
      name: "test-island",
      strategy: { type: "immediate" },
      success: false,
      duration: expect.any(Number),
    });
  });

  describe("strategy handling", () => {
    beforeEach(() => {
      mockRegistry.get.mockReturnValue(() => ({ default: vi.fn() }));
    });

    it("should call immediate strategy", async () => {
      const { immediate } = await import("../strategies/immediate.js");

      await hydrateIslands(mockCtx);

      expect(immediate).toHaveBeenCalled();
    });

    it("should call idle strategy", async () => {
      mockElement.contract!.strategy.type = "idle";

      const { idle } = await import("../strategies/idle.js");

      await hydrateIslands(mockCtx);

      expect(idle).toHaveBeenCalled();
    });

    it("should call interaction strategy with options", async () => {
      mockElement.contract!.strategy = {
        type: "interaction",
        options: ["click", "focusin"],
      };

      const { interaction } = await import("../strategies/interaction.js");

      await hydrateIslands(mockCtx);

      expect(interaction).toHaveBeenCalledWith(
        ["click", "focusin"],
        mockElement,
        expect.any(Function)
      );
    });

    it("should skip interaction strategy if options are missing", async () => {
      // @ts-expect-error
      mockElement.contract!.strategy = {
        type: "interaction",
      };

      const { interaction } = await import("../strategies/interaction.js");

      await hydrateIslands(mockCtx);

      expect(interaction).not.toHaveBeenCalled();
    });

    it("should skip interaction strategy if options are not an array", async () => {
      // @ts-expect-error
      mockElement.contract!.strategy = {
        type: "interaction",
        options: "click",
      };

      const { interaction } = await import("../strategies/interaction.js");

      await hydrateIslands(mockCtx);

      expect(interaction).not.toHaveBeenCalled();
    });

    it("should call media strategy with query", async () => {
      mockElement.contract!.strategy = {
        type: "media",
        options: "(max-width: 768px)",
      };

      const { media } = await import("../strategies/media.js");

      await hydrateIslands(mockCtx);

      expect(media).toHaveBeenCalledWith("(max-width: 768px)", expect.any(Function));
    });

    it("should skip media strategy if options are missing", async () => {
      // @ts-expect-error
      mockElement.contract!.strategy = {
        type: "media",
      };

      const { media } = await import("../strategies/media.js");

      await hydrateIslands(mockCtx);

      expect(media).not.toHaveBeenCalled();
    });

    it("should skip media strategy if options are not a string", async () => {
      mockElement.contract!.strategy = {
        type: "media",
        // @ts-expect-error
        options: ["not", "a", "string"],
      };

      const { media } = await import("../strategies/media.js");

      await hydrateIslands(mockCtx);

      expect(media).not.toHaveBeenCalled();
    });

    it("should call visible strategy", async () => {
      mockElement.contract!.strategy.type = "visible";

      const { visible } = await import("../strategies/visible.js");

      await hydrateIslands(mockCtx);

      expect(visible).toHaveBeenCalledWith(mockElement, expect.any(Function));
    });

    it("should do nothing for never strategy", async () => {
      mockElement.contract!.strategy.type = "never";

      await hydrateIslands(mockCtx);

      // No strategy functions should be called
      const { immediate } = await import("../strategies/immediate.js");
      const { idle } = await import("../strategies/idle.js");
      const { interaction } = await import("../strategies/interaction.js");
      const { media } = await import("../strategies/media.js");
      const { visible } = await import("../strategies/visible.js");

      expect(immediate).not.toHaveBeenCalled();
      expect(idle).not.toHaveBeenCalled();
      expect(interaction).not.toHaveBeenCalled();
      expect(media).not.toHaveBeenCalled();
      expect(visible).not.toHaveBeenCalled();
    });
  });
});
