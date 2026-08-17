import { describe, expect, it, vi } from "vitest";
import { MemoryCacheStore } from "../memory.js";

describe("MemoryCacheStore", () => {
  it("does not retain entries with ttl equal to zero", async () => {
    const store = new MemoryCacheStore();

    await store.set("session", "value", { ttl: 0 });

    await expect(store.get("session")).resolves.toBeUndefined();
  });

  it("removes existing entries when ttl is negative", async () => {
    const store = new MemoryCacheStore();

    await store.set("session", "value");
    await store.set("session", "new-value", { ttl: -1 });

    await expect(store.get("session")).resolves.toBeUndefined();
  });

  it("expires entries exactly at the ttl boundary", async () => {
    vi.useFakeTimers();

    try {
      const store = new MemoryCacheStore();

      await store.set("session", "value", { ttl: 1 });

      vi.advanceTimersByTime(1000);

      await expect(store.get("session")).resolves.toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns entries before they expire", async () => {
    vi.useFakeTimers();

    try {
      const store = new MemoryCacheStore();

      await store.set("session", "value", { ttl: 60 });

      vi.advanceTimersByTime(1000);

      await expect(store.get("session")).resolves.toBe("value");
    } finally {
      vi.useRealTimers();
    }
  });

  it("retains entries without a ttl indefinitely", async () => {
    const store = new MemoryCacheStore();

    await store.set("session", "value");

    await expect(store.get("session")).resolves.toBe("value");
  });

  it("deletes a single entry", async () => {
    const store = new MemoryCacheStore();

    await store.set("session", "value");
    await store.set("other", "value");

    await store.delete("session");

    await expect(store.get("session")).resolves.toBeUndefined();
    await expect(store.get("other")).resolves.toBe("value");
  });

  it("clears all entries", async () => {
    const store = new MemoryCacheStore();

    await store.set("session", "value");
    await store.set("other", "value");

    await store.clear();

    await expect(store.get("session")).resolves.toBeUndefined();
    await expect(store.get("other")).resolves.toBeUndefined();
  });
});
