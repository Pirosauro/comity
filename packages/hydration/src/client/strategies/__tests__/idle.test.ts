import { beforeEach, describe, expect, it, vi } from "vitest";
import { idle } from "../idle.js";

// Mock window
const mockRequestIdleCallback = vi.fn();
const mockSetTimeout = vi.fn();

vi.stubGlobal("window", {
  requestIdleCallback: mockRequestIdleCallback,
});

vi.stubGlobal("setTimeout", mockSetTimeout);

describe("idle", () => {
  beforeEach(() => {
    mockRequestIdleCallback.mockReset();
    mockSetTimeout.mockReset();
  });

  it("should use requestIdleCallback when available", () => {
    const run = vi.fn();
    idle(run);

    expect(mockRequestIdleCallback).toHaveBeenCalledWith(run);
  });

  it("should fallback to setTimeout when requestIdleCallback is not available", () => {
    delete (window as any).requestIdleCallback;
    const run = vi.fn();
    idle(run);

    expect(mockSetTimeout).toHaveBeenCalledWith(run, 200);
  });

  it("should call run function when idle callback executes", () => {
    vi.stubGlobal("window", {
      requestIdleCallback: (callback: any) => {
        callback();
        return 1;
      },
    });

    const run = vi.fn();
    idle(run);

    expect(run).toHaveBeenCalledTimes(1);
  });

  it("should call run function when setTimeout executes", () => {
    delete (window as any).requestIdleCallback;
    mockSetTimeout.mockImplementation((callback) => callback());

    const run = vi.fn();
    idle(run);

    expect(run).toHaveBeenCalledTimes(1);
  });
});
