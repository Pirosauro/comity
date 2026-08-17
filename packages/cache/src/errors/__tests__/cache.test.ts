import { describe, expect, it } from "vitest";
import { BaseError } from "@comity/primitives/errors";
import { CacheError } from "../cache.js";

describe("CacheError", () => {
  it("should map the missing_store reason to its message and code", () => {
    const error = new CacheError("missing_store");

    expect(error.message).toBe("No cache store configured");
    expect(error.code).toBe("cache:missing_store");
    expect(error.meta.reason).toBe("missing_store");
  });

  it("should map the get_failed reason to its message and code", () => {
    const error = new CacheError("get_failed");

    expect(error.message).toBe("Cache get failed");
    expect(error.code).toBe("cache:get_failed");
  });

  it("should map the set_failed reason to its message and code", () => {
    const error = new CacheError("set_failed");

    expect(error.message).toBe("Cache set failed");
    expect(error.code).toBe("cache:set_failed");
  });

  it("should map the delete_failed reason to its message and code", () => {
    const error = new CacheError("delete_failed");

    expect(error.message).toBe("Cache delete failed");
    expect(error.code).toBe("cache:delete_failed");
  });

  it("should preserve details metadata", () => {
    const error = new CacheError("get_failed", {
      details: { key: "user:1", namespace: "ns" },
    });

    expect(error.meta.details).toEqual({ key: "user:1", namespace: "ns" });
  });

  it("should extend BaseError", () => {
    const error = new CacheError("get_failed");

    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(Error);
  });
});