import { describe, expect, it } from "vitest";
import { BaseError } from "@comity/primitives/errors";
import { StorageError } from "../storage.js";

describe("StorageError", () => {
  it("should map reasons to their messages and codes", () => {
    const cases: Array<[StorageError["meta"]["reason"], string, string]> = [
      ["missing_store", "Storage store not configured", "storage:missing_store"],
      ["not_found", "Storage object not found", "storage:not_found"],
      ["put_failed", "Failed to store object", "storage:put_failed"],
      ["get_failed", "Failed to retrieve object", "storage:get_failed"],
      ["delete_failed", "Failed to delete object", "storage:delete_failed"],
      ["signed_url_failed", "Failed to generate signed URL", "storage:signed_url_failed"],
      ["internal", "Internal error", "storage:internal"],
    ];

    for (const [reason, message, code] of cases) {
      const error = new StorageError(reason);

      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.meta.reason).toBe(reason);
    }
  });

  it("should preserve details metadata", () => {
    const error = new StorageError("get_failed", {
      details: { key: "user:1", namespace: "ns" },
    });

    expect(error.meta.details).toEqual({ key: "user:1", namespace: "ns" });
  });

  it("should preserve the cause", () => {
    const cause = new Error("boom");
    const error = new StorageError("put_failed", { cause });

    expect(error.cause).toBe(cause);
  });

  it("should extend BaseError", () => {
    const error = new StorageError("get_failed");

    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(Error);
  });
});