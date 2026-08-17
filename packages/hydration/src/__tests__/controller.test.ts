import type { IslandElement } from "../client/island-element.js";
import type { IslandHydrationAdapter } from "../contracts/island-hydrator.js";
import type { HydrationSchedulingAdapter } from "../contracts/hydration-scheduler.js";
import type { HydrationRuntimeObserver } from "../lifecycle/runtime.js";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HydrationController } from "../controller.js";

describe("HydrationController", () => {
  let hydrator: IslandHydrationAdapter;
  let scheduler: HydrationSchedulingAdapter;
  let observer: HydrationRuntimeObserver;
  let island: IslandElement;

  beforeEach(() => {
    hydrator = {
      supports: vi.fn().mockReturnValue(true),
      hydrate: vi.fn().mockResolvedValue(undefined),
    };
    scheduler = {
      schedule: vi.fn(),
    };
    observer = {
      onIslandDiscovered: vi.fn(),
      onIslandScheduled: vi.fn(),
      onIslandHydrationStarted: vi.fn(),
      onIslandHydrationCompleted: vi.fn(),
      onIslandHydrationFailed: vi.fn(),
    };
    island = {
      contract: {
        id: "hero",
        component: "Hero",
        data: { title: "Hello" },
        strategy: { kind: "immediate" },
      },
    } as unknown as IslandElement;

    vi.stubGlobal("window", {
      performance: {
        now: vi.fn().mockReturnValue(0),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function runScheduled() {
    const run = vi.mocked(scheduler.schedule).mock.calls[0]?.[1];

    expect(run).toBeDefined();

    return run!();
  }

  it("emits invalid_contract failure when the island has no contract", () => {
    const controller = new HydrationController({ hydrator, scheduler, observer });

    controller.onDiscovered({ contract: undefined } as unknown as IslandElement);

    expect(observer.onIslandHydrationFailed).toHaveBeenCalledWith({
      reason: "invalid_contract",
      duration: 0,
    });
    expect(observer.onIslandDiscovered).not.toHaveBeenCalled();
    expect(scheduler.schedule).not.toHaveBeenCalled();
  });

  it("emits discovery event and schedules hydration", () => {
    const controller = new HydrationController({ hydrator, scheduler, observer });

    controller.onDiscovered(island);

    expect(observer.onIslandDiscovered).toHaveBeenCalledWith({
      id: "hero",
      strategy: { kind: "immediate" },
    });
    expect(scheduler.schedule).toHaveBeenCalledWith(island, expect.any(Function));
  });

  it("emits scheduled, started, and completed events during hydration", async () => {
    const controller = new HydrationController({ hydrator, scheduler, observer });

    controller.onDiscovered(island);

    await runScheduled();

    expect(observer.onIslandScheduled).toHaveBeenCalledWith({
      id: "hero",
      strategy: { kind: "immediate" },
    });
    expect(observer.onIslandHydrationStarted).toHaveBeenCalledWith({ id: "hero" });
    expect(hydrator.hydrate).toHaveBeenCalledWith(island, island.contract);
    expect(observer.onIslandHydrationCompleted).toHaveBeenCalledWith({
      id: "hero",
      duration: 0,
    });
  });

  it("emits not_registered failure when the hydrator does not support the contract", async () => {
    vi.mocked(hydrator.supports).mockReturnValue(false);

    const controller = new HydrationController({ hydrator, scheduler, observer });

    controller.onDiscovered(island);

    await runScheduled();

    expect(observer.onIslandHydrationFailed).toHaveBeenCalledWith({
      id: "hero",
      reason: "not_registered",
      duration: 0,
    });
    expect(hydrator.hydrate).not.toHaveBeenCalled();
  });

  it("emits hydrate_failed failure when hydration throws", async () => {
    vi.mocked(hydrator.hydrate).mockRejectedValue(new Error("boom"));

    const controller = new HydrationController({ hydrator, scheduler, observer });

    controller.onDiscovered(island);

    await runScheduled();

    expect(observer.onIslandHydrationFailed).toHaveBeenCalledWith({
      id: "hero",
      reason: "hydrate_failed",
      duration: 0,
    });
  });

  it("uses the default scheduler when none is provided", () => {
    const controller = new HydrationController({ hydrator, observer });

    controller.onDiscovered(island);

    expect(vi.mocked(scheduler.schedule)).not.toHaveBeenCalled();
    expect(observer.onIslandDiscovered).toHaveBeenCalled();
  });
});