import { describe, expect, it } from "vitest";
import { serializeCacheKey } from "../serialize.js";

describe("serializeCacheKey", () => {
  it("should be deterministic for the same input", () => {
    const key = { entity: "user", id: "1" };

    expect(serializeCacheKey(key)).toBe(serializeCacheKey(key));
  });

  it("should be stable regardless of key order", () => {
    const a = serializeCacheKey({ entity: "user", id: "1" });
    const b = serializeCacheKey({ id: "1", entity: "user" });

    expect(a).toBe(b);
  });

  it("should normalize dates to their ISO string", () => {
    const a = serializeCacheKey({ entity: "user", updatedAt: new Date("2024-01-15T10:30:00Z") });
    const b = serializeCacheKey({ entity: "user", updatedAt: new Date("2024-01-15T10:30:00Z") });

    expect(a).toBe(b);
  });

  it("should drop undefined values", () => {
    const a = serializeCacheKey({ entity: "user", ttl: undefined });
    const b = serializeCacheKey({ entity: "user" });

    expect(a).toBe(b);
  });

  it("should support nested objects and arrays", () => {
    const a = serializeCacheKey({ entity: "user", filter: { status: "active", tags: ["a", "b"] } });
    const b = serializeCacheKey({ filter: { tags: ["a", "b"], status: "active" }, entity: "user" });

    expect(a).toBe(b);
  });

  it("should produce different keys for different inputs", () => {
    const a = serializeCacheKey({ entity: "user", id: "1" });
    const b = serializeCacheKey({ entity: "user", id: "2" });

    expect(a).not.toBe(b);
  });

  it("should distinguish different values for the same key", () => {
    const a = serializeCacheKey({ entity: "user", status: "active" });
    const b = serializeCacheKey({ entity: "user", status: "inactive" });

    expect(a).not.toBe(b);
  });
});