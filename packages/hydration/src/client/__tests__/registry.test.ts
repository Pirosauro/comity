import { beforeEach, describe, expect, it, vi } from "vitest";
import { IslandRegistry } from "../registry.js";

describe("IslandRegistry", () => {
  let registry: IslandRegistry;
  let mockLoader: any;

  beforeEach(() => {
    registry = new IslandRegistry();
    mockLoader = vi.fn().mockResolvedValue({
      default: vi.fn().mockResolvedValue(undefined),
    });
  });

  describe("register", () => {
    it("should register a loader for a name", () => {
      registry.register("test-island", mockLoader);

      expect(registry.get("test-island")).toBe(mockLoader);
    });

    it("should allow registering multiple loaders", () => {
      const loader1 = vi.fn();
      const loader2 = vi.fn();

      registry.register("island1", loader1);
      registry.register("island2", loader2);

      expect(registry.get("island1")).toBe(loader1);
      expect(registry.get("island2")).toBe(loader2);
    });

    it("should overwrite existing loader for same name", () => {
      const loader1 = vi.fn();
      const loader2 = vi.fn();

      registry.register("test-island", loader1);
      registry.register("test-island", loader2);

      expect(registry.get("test-island")).toBe(loader2);
    });
  });

  describe("get", () => {
    it("should return registered loader", () => {
      registry.register("test-island", mockLoader);

      expect(registry.get("test-island")).toBe(mockLoader);
    });

    it("should return undefined for unregistered name", () => {
      expect(registry.get("nonexistent")).toBeUndefined();
    });
  });

  describe("list", () => {
    it("should return empty array when no loaders registered", () => {
      expect(registry.list()).toEqual([]);
    });

    it("should return all registered loaders", () => {
      const loader1 = vi.fn();
      const loader2 = vi.fn();

      registry.register("island1", loader1);
      registry.register("island2", loader2);

      const list = registry.list();
      expect(list).toHaveLength(2);
      expect(list).toContain(loader1);
      expect(list).toContain(loader2);
    });
  });

  describe("clear", () => {
    it("should remove all registered loaders", () => {
      registry.register("island1", vi.fn());
      registry.register("island2", vi.fn());

      expect(registry.list()).toHaveLength(2);

      registry.clear();

      expect(registry.list()).toEqual([]);
      expect(registry.get("island1")).toBeUndefined();
      expect(registry.get("island2")).toBeUndefined();
    });
  });
});
