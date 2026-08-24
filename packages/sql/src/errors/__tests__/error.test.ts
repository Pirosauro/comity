import { describe, expect, it } from "vitest";

import { SqlError } from "../sql.js";

describe("SqlError", () => {
  // Create a concrete implementation for testing
  class TestSqlError extends SqlError {}

  it("should instantiate with reason and meta", () => {
    const error = new TestSqlError("query_failed");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SqlError);
    expect(error.message).toBe("The SQL query failed to execute");
    expect(error.meta["reason"]).toBe("query_failed");
    expect(error.meta["httpStatus"]).toBe(500);
  });

  it("should inherit from BaseError", () => {
    const error = new TestSqlError("connection_failed");

    expect(error.name).toBe("TestSqlError");
    expect(error.code).toBe("sql:connection_failed");
  });

  it("should attach cause to error object", () => {
    const originalError = new Error("Original error");
    const error = new TestSqlError("query_failed", { cause: originalError });

    expect(error.cause).toBe(originalError);
  });

  it("should freeze metadata to prevent mutation", () => {
    const error = new TestSqlError("invalid_query", {
      details: { detail: "syntax error" },
    });

    expect(() => {
      (error.meta as any).reason = "query_failed";
    }).toThrow();

    expect(Object.isFrozen(error.meta)).toBe(true);
  });

  it("should support operation metadata", () => {
    const error = new TestSqlError("query_failed", {
      details: { operation: "query", adapter: "postgres" },
    });

    expect(error.meta["details"]?.["operation"]).toBe("query");
    expect(error.meta["details"]?.["adapter"]).toBe("postgres");
  });

  it("should support retriable flag", () => {
    const error = new TestSqlError("timeout", {
      details: { retriable: true },
    });

    expect(error.meta["details"]?.["retriable"]).toBe(true);
  });

  it("should support detail field", () => {
    const error = new TestSqlError("invalid_query", {
      details: { detail: "42601" },
    });

    expect(error.meta["details"]?.["detail"]).toBe("42601");
  });

  it("should support multiple reasons", () => {
    const reasons: Array<SqlError["meta"]["reason"]> = [
      "connection_failed",
      "invalid_configuration",
      "invalid_query",
      "query_failed",
      "transaction_failed",
      "timeout",
      "cancelled",
    ];

    for (const reason of reasons) {
      const error = new TestSqlError(reason);
      expect(error.meta["reason"]).toBe(reason);
      expect(error.code).toBe(`sql:${reason}`);
    }
  });

  it("should work with additional metadata properties", () => {
    const error = new TestSqlError("query_failed", {
      details: { operation: "query", adapter: "mysql", retriable: false, detail: "1234" },
    });

    expect(error.meta["reason"]).toBe("query_failed");
    expect(error.meta["details"]?.["operation"]).toBe("query");
    expect(error.meta["details"]?.["adapter"]).toBe("mysql");
    expect(error.meta["details"]?.["retriable"]).toBe(false);
    expect(error.meta["details"]?.["detail"]).toBe("1234");
  });

  it("should handle undefined optional metadata", () => {
    const error = new TestSqlError("query_failed");

    expect(error.meta["details"]).toBeUndefined();
  });

  it("should maintain metadata immutability across instances", () => {
    const error1 = new TestSqlError("query_failed");
    const error2 = new TestSqlError("connection_failed");

    expect(error1.meta["reason"]).toBe("query_failed");
    expect(error2.meta["reason"]).toBe("connection_failed");
    expect(Object.isFrozen(error1.meta)).toBe(true);
    expect(Object.isFrozen(error2.meta)).toBe(true);
  });
});