// @vitest-environment jsdom
import type { ComityIslandElement } from "../../element.js";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { interaction } from "../interaction.js";

describe("interaction", () => {
  let mockElement: ComityIslandElement;
  let events: ["click", "focusin"];

  beforeEach(() => {
    // @ts-expect-error
    mockElement = {
      hydrated: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    events = ["click", "focusin"];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add event listeners for specified events", () => {
    const run = vi.fn();

    interaction(events, mockElement, run);

    expect(mockElement.addEventListener).toHaveBeenCalledTimes(2);
    expect(mockElement.addEventListener).toHaveBeenCalledWith("click", expect.any(Function), {
      once: true,
    });
    expect(mockElement.addEventListener).toHaveBeenCalledWith("focusin", expect.any(Function), {
      once: true,
    });
  });

  it("should call run and set hydrated when event fires", () => {
    const run = vi.fn();
    let handler: Function = () => {};

    // @ts-ignore
    mockElement.addEventListener.mockImplementation((event: string, h: Function) => {
      handler = h;
    });

    interaction(["click"], mockElement, run);

    // Simulate event
    const mockEvent = {};

    handler(mockEvent);

    expect(run).toHaveBeenCalledTimes(1);
    expect(mockElement.hydrated).toBeGreaterThan(0);
  });

  it("should not call run if already hydrated", () => {
    const run = vi.fn();
    mockElement.hydrated = Date.now();

    let handler = () => {};

    // @ts-ignore
    mockElement.addEventListener.mockImplementation((event, h) => {
      handler = h;
    });

    interaction(["click"], mockElement, run);

    // Simulate event
    handler();

    expect(run).not.toHaveBeenCalled();
  });

  it("should remove event listeners after hydration", () => {
    const run = vi.fn();
    let handler: any;

    // @ts-ignore
    mockElement.addEventListener.mockImplementation((event, h) => {
      handler = h;
    });

    interaction(["click"], mockElement, run);

    // Simulate event
    handler();

    expect(mockElement.removeEventListener).toHaveBeenCalledWith("click", handler);
  });

  it("should handle multiple events", () => {
    const run = vi.fn();
    const handlers: any[] = [];

    // @ts-ignore
    mockElement.addEventListener.mockImplementation((event, h) => {
      handlers.push(h);
    });

    interaction(events, mockElement, run);

    // Simulate first event
    handlers[0]();
    expect(run).toHaveBeenCalledTimes(1);
    expect(mockElement.hydrated).toBeGreaterThan(0);

    // Second event should not trigger again
    handlers[1]();
    expect(run).toHaveBeenCalledTimes(1);
  });
});
