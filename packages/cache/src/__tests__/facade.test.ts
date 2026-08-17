import type { CacheStore } from "../contracts/store.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultCache } from "../facade.js";

describe("DefaultCache", () => {
  let store: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let cache: DefaultCache;

  beforeEach(() => {
    store = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    };

    cache = new DefaultCache(store as unknown as CacheStore);
  });

  describe("get", () => {
    it("should delegate to the store with the key", async () => {
      store.get.mockResolvedValue("value");

      const value = await cache.get("key");

      expect(store.get).toHaveBeenCalledWith("key");
      expect(value).toBe("value");
    });

    it("should prefix the key with the namespace", async () => {
      store.get.mockResolvedValue("value");

      await cache.get("key", { namespace: "ns" });

      expect(store.get).toHaveBeenCalledWith("ns:key");
    });
  });

  describe("set", () => {
    it("should delegate to the store with the key and value", async () => {
      await cache.set("key", "value");

      expect(store.set).toHaveBeenCalledWith("key", "value", {});
    });

    it("should pass the ttl to the store", async () => {
      await cache.set("key", "value", { ttl: 60 });

      expect(store.set).toHaveBeenCalledWith("key", "value", { ttl: 60 });
    });

    it("should omit the ttl when not provided", async () => {
      await cache.set("key", "value");

      expect(store.set.mock.calls[0][2]).toEqual({});
    });

    it("should prefix the key with the namespace", async () => {
      await cache.set("key", "value", { namespace: "ns" });

      expect(store.set).toHaveBeenCalledWith("ns:key", "value", {});
    });
  });

  describe("delete", () => {
    it("should delegate to the store with the key", async () => {
      await cache.delete("key");

      expect(store.delete).toHaveBeenCalledWith("key");
    });

    it("should prefix the key with the namespace", async () => {
      await cache.delete("key", { namespace: "ns" });

      expect(store.delete).toHaveBeenCalledWith("ns:key");
    });
  });

  describe("getOrSet", () => {
    it("should return the cached value when present", async () => {
      store.get.mockResolvedValue("cached");
      const loader = vi.fn().mockResolvedValue("loaded");

      const value = await cache.getOrSet("key", loader);

      expect(value).toBe("cached");
      expect(loader).not.toHaveBeenCalled();
      expect(store.set).not.toHaveBeenCalled();
    });

    it("should load and store the value when absent", async () => {
      store.get.mockResolvedValue(undefined);
      const loader = vi.fn().mockResolvedValue("loaded");

      const value = await cache.getOrSet("key", loader);

      expect(value).toBe("loaded");
      expect(loader).toHaveBeenCalledTimes(1);
      expect(store.set).toHaveBeenCalledWith("key", "loaded", {});
    });

    it("should propagate the ttl when loading a missing value", async () => {
      store.get.mockResolvedValue(undefined);
      const loader = vi.fn().mockResolvedValue("loaded");

      await cache.getOrSet("key", loader, { ttl: 60 });

      expect(store.set).toHaveBeenCalledWith("key", "loaded", { ttl: 60 });
    });

    it("should propagate the namespace when loading a missing value", async () => {
      store.get.mockResolvedValue(undefined);
      const loader = vi.fn().mockResolvedValue("loaded");

      await cache.getOrSet("key", loader, { namespace: "ns" });

      expect(store.get).toHaveBeenCalledWith("ns:key");
      expect(store.set).toHaveBeenCalledWith("ns:key", "loaded", {});
    });
  });
});