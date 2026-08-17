import { describe, expect, it } from "vitest";
import { MemoryStorageStore } from "../memory.js";

function bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

describe("MemoryStorageStore", () => {
  it("returns undefined for a missing key", async () => {
    const store = new MemoryStorageStore();

    await expect(store.get("missing")).resolves.toBeUndefined();
  });

  it("stores and retrieves a string body", async () => {
    const store = new MemoryStorageStore();

    await store.put("key", "hello");

    const obj = await store.get("key");

    expect(obj?.body).toEqual(bytes("hello"));
    expect(obj?.contentLength).toBe(5);
  });

  it("stores a Uint8Array body as-is", async () => {
    const store = new MemoryStorageStore();
    const body = bytes("binary");

    await store.put("key", body);

    const obj = await store.get("key");

    expect(obj?.body).toBe(body);
    expect(obj?.contentLength).toBe(6);
  });

  it("stores an ArrayBuffer body", async () => {
    const store = new MemoryStorageStore();
    const body = bytes("buffer").buffer;

    await store.put("key", body);

    const obj = await store.get("key");

    expect(obj?.body).toEqual(bytes("buffer"));
  });

  it("stores a ReadableStream body", async () => {
    const store = new MemoryStorageStore();
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes("streamed"));
        controller.close();
      },
    });

    await store.put("key", body);

    const obj = await store.get("key");

    expect(obj?.body).toEqual(bytes("streamed"));
  });

  it("preserves contentType and meta", async () => {
    const store = new MemoryStorageStore();

    await store.put("key", "hello", { contentType: "text/plain", meta: { a: "b" } });

    const obj = await store.get("key");

    expect(obj?.contentType).toBe("text/plain");
    expect(obj?.meta).toEqual({ a: "b" });
  });

  it("omits contentType and meta when not provided", async () => {
    const store = new MemoryStorageStore();

    await store.put("key", "hello");

    const obj = await store.get("key");

    expect(obj?.contentType).toBeUndefined();
    expect(obj?.meta).toBeUndefined();
  });

  it("overwrites an existing key", async () => {
    const store = new MemoryStorageStore();

    await store.put("key", "first");
    await store.put("key", "second");

    const obj = await store.get("key");

    expect(obj?.body).toEqual(bytes("second"));
  });

  it("deletes a key", async () => {
    const store = new MemoryStorageStore();

    await store.put("key", "hello");
    await store.delete("key");

    await expect(store.get("key")).resolves.toBeUndefined();
  });

  it("checks existence", async () => {
    const store = new MemoryStorageStore();

    await expect(store.exists("key")).resolves.toBe(false);

    await store.put("key", "hello");

    await expect(store.exists("key")).resolves.toBe(true);
  });

  it("rejects unsupported body types", async () => {
    const store = new MemoryStorageStore();

    await expect(store.put("key", 42 as unknown as string)).rejects.toMatchObject({
      code: "storage:internal",
    });
  });
});