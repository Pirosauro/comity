import { describe, expect, it, vi } from "vitest";
import { Lazy } from "../lazy.js";

describe("Lazy", () => {
  describe("constructor", () => {
    it("should create lazy instance with factory", () => {
      const factory = vi.fn(() => "test value");
      const lazy = new Lazy(factory);

      expect(lazy).toBeInstanceOf(Lazy);
      expect(factory).not.toHaveBeenCalled();
    });
  });

  describe("value getter", () => {
    it("should call factory on first access", () => {
      const factory = vi.fn(() => "computed value");
      const lazy = new Lazy(factory);

      expect(factory).not.toHaveBeenCalled();

      const value = lazy.value;

      expect(factory).toHaveBeenCalledTimes(1);
      expect(value).toBe("computed value");
    });

    it("should cache the value after first access", () => {
      const factory = vi.fn(() => ({ count: 0 }));
      const lazy = new Lazy(factory);

      const value1 = lazy.value;
      const value2 = lazy.value;
      const value3 = lazy.value;

      expect(factory).toHaveBeenCalledTimes(1);
      expect(value1).toBe(value2);
      expect(value2).toBe(value3);
      expect(value1).toEqual({ count: 0 });
    });

    it("should handle different types", () => {
      const stringLazy = new Lazy(() => "string");
      const numberLazy = new Lazy(() => 42);
      const objectLazy = new Lazy(() => ({ key: "value" }));
      const arrayLazy = new Lazy(() => [1, 2, 3]);

      expect(stringLazy.value).toBe("string");
      expect(numberLazy.value).toBe(42);
      expect(objectLazy.value).toEqual({ key: "value" });
      expect(arrayLazy.value).toEqual([1, 2, 3]);
    });

    it("should handle factory that throws", () => {
      const factory = vi.fn(() => {
        throw new Error("Factory error");
      });
      const lazy = new Lazy(factory);

      expect(() => lazy.value).toThrow("Factory error");
      expect(factory).toHaveBeenCalledTimes(1);

      // Should not cache error, but since it threw, next access will try again
      expect(() => lazy.value).toThrow("Factory error");
      expect(factory).toHaveBeenCalledTimes(2);
    });

    it("should handle factory returning undefined", () => {
      const factory = vi.fn(() => undefined);
      const lazy = new Lazy<undefined>(factory);

      expect(lazy.value).toBeUndefined();
      expect(lazy.value).toBeUndefined();
      expect(factory).toHaveBeenCalledTimes(2); // Not cached for undefined
    });

    it("should handle factory returning null", () => {
      const factory = vi.fn(() => null);
      const lazy = new Lazy<null>(factory);

      expect(lazy.value).toBeNull();
      expect(lazy.value).toBeNull();
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it("should handle complex factory logic", () => {
      let counter = 0;
      const factory = vi.fn(() => {
        counter++;
        return `value-${counter}`;
      });
      const lazy = new Lazy(factory);

      expect(lazy.value).toBe("value-1");
      expect(lazy.value).toBe("value-1"); // Cached
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });
});
