import { describe, it, expect, vi } from "vitest";
import { Lazy } from "../lazy.js";

describe("Lazy", () => {
  it("should not call factory until value is accessed", () => {
    const factory = vi.fn(() => 42);
    const lazy = new Lazy(factory);
    expect(factory).not.toHaveBeenCalled();
    void lazy; // still not called
    expect(factory).not.toHaveBeenCalled();
  });

  it("should call factory only once and cache the value", () => {
    const factory = vi.fn(() => Math.random());
    const lazy = new Lazy(factory);
    const first = lazy.value;
    const second = lazy.value;
    expect(factory).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
  });

  it("should return the value produced by the factory", () => {
    const lazy = new Lazy(() => "hello");
    expect(lazy.value).toBe("hello");
  });

  it("should support factories that return objects", () => {
    const obj = { a: 1 };
    const lazy = new Lazy(() => obj);
    expect(lazy.value).toBe(obj);
  });

  it("should support factories that throw errors", () => {
    const lazy = new Lazy(() => {
      throw new Error("fail");
    });
    expect(() => lazy.value).toThrow("fail");
  });
});
