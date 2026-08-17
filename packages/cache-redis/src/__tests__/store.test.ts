import type { RedisClient } from "../types.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { RedisCacheStore } from "../store.js";

describe("RedisCacheStore", () => {
  let client: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    del: ReturnType<typeof vi.fn>;
  };
  let store: RedisCacheStore;

  beforeEach(() => {
    client = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    };

    store = new RedisCacheStore(client as unknown as RedisClient);
  });

  describe("get", () => {
    it("should return the value from the client", async () => {
      client.get.mockResolvedValue("value");

      await expect(store.get("key")).resolves.toBe("value");
      expect(client.get).toHaveBeenCalledWith("key");
    });

    it("should convert a null result to undefined", async () => {
      client.get.mockResolvedValue(null);

      await expect(store.get("key")).resolves.toBeUndefined();
    });
  });

  describe("set", () => {
    it("should store a value without a ttl", async () => {
      await store.set("key", "value");

      expect(client.set).toHaveBeenCalledWith("key", "value");
    });

    it("should store a value with an expiration", async () => {
      await store.set("key", "value", { ttl: 60 });

      expect(client.set).toHaveBeenCalledWith("key", "value", "EX", 60);
    });

    it("should delete the key when the ttl is zero", async () => {
      await store.set("key", "value", { ttl: 0 });

      expect(client.del).toHaveBeenCalledWith("key");
      expect(client.set).not.toHaveBeenCalled();
    });

    it("should delete the key when the ttl is negative", async () => {
      await store.set("key", "value", { ttl: -1 });

      expect(client.del).toHaveBeenCalledWith("key");
      expect(client.set).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delegate to the client", async () => {
      await store.delete("key");

      expect(client.del).toHaveBeenCalledWith("key");
    });
  });
});