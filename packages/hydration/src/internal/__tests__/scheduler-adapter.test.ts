import type { IslandElement } from "../../client/island-element.js";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultHydrationScheduler } from "../scheduler-adapter.js";

describe("DefaultHydrationScheduler", () => {
  let scheduler: DefaultHydrationScheduler;

  beforeEach(() => {
    scheduler = new DefaultHydrationScheduler();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function islandWithContract(contract: IslandElement["contract"]) {
    return {
      contract,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as IslandElement;
  }

  it("runs immediately when the contract has no strategy", () => {
    const run = vi.fn().mockResolvedValue(undefined);

    scheduler.schedule(islandWithContract(undefined), run);

    expect(run).toHaveBeenCalled();
  });

  it("runs immediately for the immediate strategy", () => {
    const run = vi.fn().mockResolvedValue(undefined);

    scheduler.schedule(islandWithContract({ strategy: { kind: "immediate" } } as IslandElement["contract"]), run);

    expect(run).toHaveBeenCalled();
  });

  it("runs immediately for unknown strategy kinds", () => {
    const run = vi.fn().mockResolvedValue(undefined);

    scheduler.schedule(
      islandWithContract({ strategy: { kind: "never" } } as IslandElement["contract"]),
      run
    );

    expect(run).toHaveBeenCalled();
  });

  it("schedules via requestIdleCallback when available", () => {
    const idleCb = vi.fn();
    const run = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal("window", { requestIdleCallback: idleCb });

    scheduler.schedule(islandWithContract({ strategy: { kind: "idle" } } as IslandElement["contract"]), run);

    expect(idleCb).toHaveBeenCalledWith(run);
    expect(run).not.toHaveBeenCalled();
  });

  it("falls back to setTimeout when requestIdleCallback is unavailable", () => {
    const run = vi.fn().mockResolvedValue(undefined);

    vi.useFakeTimers();
    vi.stubGlobal("window", {});

    scheduler.schedule(islandWithContract({ strategy: { kind: "idle" } } as IslandElement["contract"]), run);

    expect(run).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);

    expect(run).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("hydrates when a visible island intersects the viewport", () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const island = islandWithContract({
      strategy: { kind: "visible" },
    } as IslandElement["contract"]);

    let observerCallback: IntersectionObserverCallback | undefined;

    class FakeIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }

      observe = vi.fn();

      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    scheduler.schedule(island, run);

    expect(observerCallback).toBeDefined();

    observerCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);

    expect(run).toHaveBeenCalled();
  });

  it("does not hydrate a visible island that is not intersecting", () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const island = islandWithContract({
      strategy: { kind: "visible" },
    } as IslandElement["contract"]);

    let observerCallback: IntersectionObserverCallback | undefined;

    class FakeIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }

      observe = vi.fn();

      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    scheduler.schedule(island, run);

    observerCallback!([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);

    expect(run).not.toHaveBeenCalled();
  });

  it("hydrates on interaction events", () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const island = islandWithContract({
      strategy: { kind: "interaction", options: ["pointerdown", "click"] },
    } as IslandElement["contract"]);

    scheduler.schedule(island, run);

    expect(island.addEventListener).toHaveBeenCalledWith("pointerdown", expect.any(Function), {
      once: true,
    });
    expect(island.addEventListener).toHaveBeenCalledWith("click", expect.any(Function), {
      once: true,
    });
    expect(run).not.toHaveBeenCalled();
  });

  it("runs and cleans up listeners on interaction", () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const island = islandWithContract({
      strategy: { kind: "interaction", options: ["click"] },
    } as IslandElement["contract"]);

    scheduler.schedule(island, run);

    const handler = vi.mocked(island.addEventListener).mock.calls[0]?.[1] as () => void;

    handler();

    expect(run).toHaveBeenCalledTimes(1);
    expect(island.removeEventListener).toHaveBeenCalledWith("click", handler);
  });

  it("hydrates immediately when the media query matches", () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const island = islandWithContract({
      strategy: { kind: "media", options: "(min-width: 768px)" },
    } as IslandElement["contract"]);

    const addListener = vi.fn();
    const removeListener = vi.fn();

    vi.stubGlobal("window", {
      matchMedia: vi.fn().mockReturnValue({
        matches: true,
        addEventListener: addListener,
        removeEventListener: removeListener,
      }),
    });

    scheduler.schedule(island, run);

    expect(run).toHaveBeenCalled();
  });

  it("hydrates when the media query starts matching", () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const island = islandWithContract({
      strategy: { kind: "media", options: "(min-width: 768px)" },
    } as IslandElement["contract"]);

    let changeListener: ((evt: MediaQueryListEvent) => void) | undefined;
    const addListener = vi.fn((_type: string, listener: (evt: MediaQueryListEvent) => void) => {
      changeListener = listener;
    });
    const removeListener = vi.fn();

    vi.stubGlobal("window", {
      matchMedia: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: addListener,
        removeEventListener: removeListener,
      }),
    });

    scheduler.schedule(island, run);

    expect(run).not.toHaveBeenCalled();

    changeListener!({ matches: true } as MediaQueryListEvent);
    changeListener!({ matches: false } as MediaQueryListEvent);

    expect(run).toHaveBeenCalledTimes(1);
    expect(removeListener).toHaveBeenCalledWith("change", changeListener);
  });
});