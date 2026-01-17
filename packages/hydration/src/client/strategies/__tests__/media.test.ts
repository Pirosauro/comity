// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { media } from "../media.js";

// Mock window.matchMedia
const mockMatchMedia = vi.fn();

vi.stubGlobal("window", { matchMedia: mockMatchMedia });

describe("media", () => {
  beforeEach(() => {
    mockMatchMedia.mockClear();
  });
  it("should call run immediately if media query matches", () => {
    const mockMql = {
      matches: true,
      addEventListener: vi.fn(),
    };

    mockMatchMedia.mockReturnValue(mockMql);

    const run = vi.fn();

    media("(max-width: 768px)", run);

    expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 768px)");
    expect(run).toHaveBeenCalledTimes(1);
    expect(mockMql.addEventListener).not.toHaveBeenCalled();
  });

  it("should add event listener if media query does not match", () => {
    const mockMql = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMql);

    const run = vi.fn();

    media("(max-width: 768px)", run);

    expect(mockMql.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    expect(run).not.toHaveBeenCalled();
  });

  it("should call run and remove listener when media query starts matching", () => {
    const mockMql = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    let changeHandler: any;

    mockMql.addEventListener.mockImplementation((event: string, handler: Function) => {
      changeHandler = handler;
    });

    mockMatchMedia.mockReturnValue(mockMql);

    const run = vi.fn();

    media("(max-width: 768px)", run);

    // Simulate media query change to matching
    const event = { matches: true };

    changeHandler(event);

    expect(run).toHaveBeenCalledTimes(1);
    expect(mockMql.removeEventListener).toHaveBeenCalledWith("change", changeHandler);
  });

  it("should not call run when media query changes but still doesn't match", () => {
    const mockMql = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    let changeHandler: any;

    mockMql.addEventListener.mockImplementation((event: string, handler: Function) => {
      changeHandler = handler;
    });

    mockMatchMedia.mockReturnValue(mockMql);

    const run = vi.fn();

    media("(max-width: 768px)", run);

    // Simulate media query change but still not matching
    const event = { matches: false };

    changeHandler(event);

    expect(run).not.toHaveBeenCalled();
    expect(mockMql.removeEventListener).not.toHaveBeenCalled();
  });
});
