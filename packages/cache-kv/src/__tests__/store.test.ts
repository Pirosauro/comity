import type { KvNamespace } from "../types.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { KvCacheStore } from "../store.js";

describe("KvCacheStore", () => {
  let ns: {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let store: KvCacheStore;

  beforeEach(() => {
    ns = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    store = new KvCacheStore(ns as unknown as KvNamespace);
  });

  describe("get", () => {
    it("should return the value from the namespace", async () => {
      ns.get.mockResolvedValue("value");

      await expect(store.get("key")).resolves.toBe("value");
      expect(ns.get).toHaveBeenCalledWith("key");
    });

    it("should convert a null result to undefined", async () => {
      ns.get.mockResolvedValue(null);

      await expect(store.get("key")).resolves.toBeUndefined();
    });
  });

  describe("set", () => {
    it("should store a value without a ttl", async () => {
      await store.set("key", "value");

      expect(ns.put).toHaveBeenCalledWith("key", "value", {});
    });

    it("should store a value with a ttl", async () => {
      await store.set("key", "value", { ttl: 60 });

      expect(ns.put).toHaveBeenCalledWith("key", "value", { expirationTtl: 60 });
    });

    it("should delete the key when the ttl is zero", async () => {
      await store.set("key", "value", { ttl: 0 });

      expect(ns.delete).toHaveBeenCalledWith("key");
      expect(ns.put).not.toHaveBeenCalled();
    });

    it("should delete the key when the ttl is negative", async () => {
      await store.set("key", "value", { ttl: -1 });

      expect(ns.delete).toHaveBeenCalledWith("key");
      expect(ns.put).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delegate to the namespace", async () => {
      await store.delete("key");

      expect(ns.delete).toHaveBeenCalledWith("key");
    });
  });
});