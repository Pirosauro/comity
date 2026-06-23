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
});
