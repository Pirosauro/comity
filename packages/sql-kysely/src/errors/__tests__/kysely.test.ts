import { describe, expect, it } from "vitest";

import { SqlError } from "@comity/sql/errors";

import { KyselySqlError } from "../kysely.js";

describe("KyselySqlError", () => {
  it("should extend SqlError", () => {
    const error = new KyselySqlError("test message", {
      reason: "connection-failed",
      retriable: false,
      adapter: "test",
      operation: "query",
    });

    expect(error).toBeInstanceOf(SqlError);
    expect(error).toBeInstanceOf(KyselySqlError);
  });

  it("should have the correct code", () => {
    const error = new KyselySqlError("test message", {
      reason: "connection-failed",
      retriable: false,
      adapter: "test",
      operation: "query",
    });

    expect(error.code).toBe("sql:kysely_adapter");
  });

  it("should preserve message and meta", () => {
    const message = "test error message";
    const meta = {
      reason: "connection-failed" as const,
      retriable: false,
      adapter: "test-adapter",
      operation: "query" as const,
    };

    const error = new KyselySqlError(message, meta);

    expect(error.message).toBe(message);
    expect(error.meta).toEqual(meta);
  });
});
