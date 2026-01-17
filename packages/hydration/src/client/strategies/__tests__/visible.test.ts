// @vitest-environment jsdom
import type { ComityIslandElement } from "../../element.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { visible } from "../visible.js";

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let observerCallback: any;

class MockIntersectionObserver {
  constructor(callback: any, options?: any) {
    observerCallback = callback;
  }

  observe = mockObserve;
  disconnect = mockDisconnect;
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

describe("visible", () => {
  const mockElement = {} as ComityIslandElement;

  beforeEach(() => {
    mockObserve.mockClear();
    mockDisconnect.mockClear();
  });

  it("should create an IntersectionObserver", () => {
    const run = vi.fn();

    visible(mockElement, run);

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it("should observe the element", () => {
    const run = vi.fn();

    visible(mockElement, run);

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it("should call run and disconnect when element becomes visible", () => {
    const run = vi.fn();

    visible(mockElement, run);

    // Simulate intersection - element is visible
    const entries = [{ isIntersecting: true }];
    observerCallback(entries);

    expect(run).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("should not call run when element is not visible", () => {
    const run = vi.fn();

    visible(mockElement, run);

    // Simulate no intersection
    const entries = [{ isIntersecting: false }];
    observerCallback(entries);

    expect(run).not.toHaveBeenCalled();
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it("should handle multiple entries", () => {
    const run = vi.fn();

    visible(mockElement, run);

    // Simulate multiple entries, first one visible
    // Note: The implementation only checks the first entry
    const entries = [{ isIntersecting: true }, { isIntersecting: false }];
    observerCallback(entries);

    expect(run).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
