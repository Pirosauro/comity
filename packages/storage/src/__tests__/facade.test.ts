import type { StorageStore } from "../contracts/store.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultStorage } from "../facade.js";
import { StorageError } from "../errors/storage.js";

describe("DefaultStorage", () => {
  let store: {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    exists: ReturnType<typeof vi.fn>;
    getSignedUrl?: ReturnType<typeof vi.fn>;
  };
  let storage: DefaultStorage;

  beforeEach(() => {
    store = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
    };

    storage = new DefaultStorage(store as unknown as StorageStore);
  });

  describe("get", () => {
    it("should delegate to the store with the key", async () => {
      const obj = { body: new Uint8Array([1, 2]) };
      store.get.mockResolvedValue(obj);

      await expect(storage.get("key")).resolves.toBe(obj);
      expect(store.get).toHaveBeenCalledWith("key");
    });

    it("should prefix the key with the namespace", async () => {
      store.get.mockResolvedValue(undefined);

      await storage.get("key", { namespace: "ns" });

      expect(store.get).toHaveBeenCalledWith("ns:key");
    });

    it("should wrap store errors in a StorageError", async () => {
      const cause = new Error("boom");
      store.get.mockRejectedValue(cause);

      await expect(storage.get("key")).rejects.toBeInstanceOf(StorageError);
      await expect(storage.get("key")).rejects.toMatchObject({
        code: "storage:get_failed",
      });
    });

    it("should include the namespace in the wrapped error", async () => {
      store.get.mockRejectedValue(new Error("boom"));

      await expect(storage.get("key", { namespace: "ns" })).rejects.toMatchObject({
        code: "storage:get_failed",
        meta: { details: { key: "key", namespace: "ns" } },
      });
    });
  });

  describe("put", () => {
    it("should delegate to the store with the key and body", async () => {
      const body = new Uint8Array([1, 2]);

      await storage.put("key", body);

      expect(store.put).toHaveBeenCalledWith("key", body, {});
    });

    it("should pass contentType and meta", async () => {
      const body = new Uint8Array([1, 2]);

      await storage.put("key", body, { contentType: "text/plain", meta: { a: "b" } });

      expect(store.put).toHaveBeenCalledWith("key", body, {
        contentType: "text/plain",
        metadata: { a: "b" },
      });
    });

    it("should prefix the key with the namespace", async () => {
      await storage.put("key", new Uint8Array(), { namespace: "ns" });

      expect(store.put).toHaveBeenCalledWith("ns:key", new Uint8Array(), {});
    });

    it("should wrap store errors in a StorageError", async () => {
      const cause = new Error("boom");
      store.put.mockRejectedValue(cause);

      await expect(storage.put("key", new Uint8Array())).rejects.toMatchObject({
        code: "storage:put_failed",
      });
    });

    it("should include the namespace in the wrapped error", async () => {
      store.put.mockRejectedValue(new Error("boom"));

      await expect(
        storage.put("key", new Uint8Array(), { namespace: "ns" })
      ).rejects.toMatchObject({
        code: "storage:put_failed",
        meta: { details: { key: "key", namespace: "ns" } },
      });
    });
  });

  describe("delete", () => {
    it("should delegate to the store with the key", async () => {
      await storage.delete("key");

      expect(store.delete).toHaveBeenCalledWith("key");
    });

    it("should prefix the key with the namespace", async () => {
      await storage.delete("key", { namespace: "ns" });

      expect(store.delete).toHaveBeenCalledWith("ns:key");
    });

    it("should wrap store errors in a StorageError", async () => {
      store.delete.mockRejectedValue(new Error("boom"));

      await expect(storage.delete("key")).rejects.toMatchObject({
        code: "storage:delete_failed",
      });
    });

    it("should include the namespace in the wrapped error", async () => {
      store.delete.mockRejectedValue(new Error("boom"));

      await expect(storage.delete("key", { namespace: "ns" })).rejects.toMatchObject({
        code: "storage:delete_failed",
        meta: { details: { key: "key", namespace: "ns" } },
      });
    });
  });

  describe("exists", () => {
    it("should delegate to the store with the key", async () => {
      store.exists.mockResolvedValue(true);

      await expect(storage.exists("key")).resolves.toBe(true);
      expect(store.exists).toHaveBeenCalledWith("key");
    });

    it("should prefix the key with the namespace", async () => {
      store.exists.mockResolvedValue(false);

      await expect(storage.exists("key", { namespace: "ns" })).resolves.toBe(false);
      expect(store.exists).toHaveBeenCalledWith("ns:key");
    });
  });

  describe("getSignedUrl", () => {
    it("should throw when the store does not support signed URLs", async () => {
      await expect(storage.getSignedUrl("key")).rejects.toMatchObject({
        code: "storage:signed_url_failed",
      });
    });

    it("should delegate to the store when supported", async () => {
      store.getSignedUrl = vi.fn().mockResolvedValue("https://signed");
      storage = new DefaultStorage(store as unknown as StorageStore);

      await expect(storage.getSignedUrl("key")).resolves.toBe("https://signed");
      expect(store.getSignedUrl).toHaveBeenCalledWith("key", {});
    });

    it("should pass expiresIn and namespace", async () => {
      store.getSignedUrl = vi.fn().mockResolvedValue("https://signed");
      storage = new DefaultStorage(store as unknown as StorageStore);

      await storage.getSignedUrl("key", { namespace: "ns", expiresIn: 60 });

      expect(store.getSignedUrl).toHaveBeenCalledWith("ns:key", { expiresIn: 60 });
    });
  });
});