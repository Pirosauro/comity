import { describe, expect, it } from "vitest";

import { SqlError } from "../sql.js";

describe("SqlError", () => {
  // Create a concrete implementation for testing
  class TestSqlError extends SqlError {
    readonly code = "sql:test";
  }

  it("should instantiate with message and meta", () => {
    const meta = { reason: "query-failed" as const };
    const error = new TestSqlError("Test error", meta);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SqlError);
    expect(error.message).toBe("Test error");
    expect(error.meta["reason"]).toBe("query-failed");
  });

  it("should inherit from BaseError", () => {
    const meta = { reason: "connection-failed" as const };
    const error = new TestSqlError("Connection failed", meta);

    expect(error.name).toBe("TestSqlError");
    expect(error.code).toBe("sql:test");
  });

  it("should attach cause to error object", () => {
    const originalError = new Error("Original error");
    const meta = { reason: "query-failed" as const, cause: originalError };
    const error = new TestSqlError("Wrapped error", meta);

    expect(error.cause).toBe(originalError);
  });

  it("should freeze metadata to prevent mutation", () => {
    const meta = { reason: "invalid-query" as const, detail: "syntax error" };
    const error = new TestSqlError("Invalid query", meta);

    expect(() => {
      (error.meta as any).reason = "query-failed";
    }).toThrow();

    expect(Object.isFrozen(error.meta)).toBe(true);
  });

  it("should support operation metadata", () => {
    const meta = {
      reason: "query-failed" as const,
      operation: "query" as const,
      adapter: "postgres",
    };
    const error = new TestSqlError("Query failed", meta);

    expect(error.meta["operation"]).toBe("query");
    expect(error.meta["adapter"]).toBe("postgres");
  });

  it("should support retriable flag", () => {
    const meta = {
      reason: "timeout" as const,
      retriable: true,
    };
    const error = new TestSqlError("Operation timed out", meta);

    expect(error.meta["retriable"]).toBe(true);
  });

  it("should support detail field", () => {
    const meta = {
      reason: "invalid-query" as const,
      detail: "42601",
    };
    const error = new TestSqlError("Syntax error", meta);

    expect(error.meta["detail"]).toBe("42601");
  });

  it("should support multiple reasons", () => {
    const reasons: Array<
      | "connection-failed"
      | "invalid-query"
      | "query-failed"
      | "transaction-failed"
      | "timeout"
      | "cancelled"
    > = [
      "connection-failed",
      "invalid-query",
      "query-failed",
      "transaction-failed",
      "timeout",
      "cancelled",
    ];

    for (const reason of reasons) {
      const error = new TestSqlError(`Error: ${reason}`, { reason });
      expect(error.meta["reason"]).toBe(reason);
    }
  });

  it("should work with additional metadata properties", () => {
    const meta = {
      reason: "query-failed" as const,
      operation: "query" as const,
      adapter: "mysql",
      retriable: false,
      detail: 1234,
    };
    const error = new TestSqlError("MySQL error", meta);

    expect(error.meta["reason"]).toBe("query-failed");
    expect(error.meta["operation"]).toBe("query");
    expect(error.meta["adapter"]).toBe("mysql");
    expect(error.meta["retriable"]).toBe(false);
    expect(error.meta["detail"]).toBe(1234);
  });

  it("should handle undefined optional metadata", () => {
    const meta = { reason: "query-failed" as const };
    const error = new TestSqlError("Error", meta);

    expect(error.meta["operation"]).toBeUndefined();
    expect(error.meta["adapter"]).toBeUndefined();
    expect(error.meta["retriable"]).toBeUndefined();
    expect(error.meta["detail"]).toBeUndefined();
  });

  it("should maintain metadata immutability across instances", () => {
    const error1 = new TestSqlError("Error 1", {
      reason: "query-failed" as const,
    });
    const error2 = new TestSqlError("Error 2", {
      reason: "connection-failed" as const,
    });

    expect(error1.meta["reason"]).toBe("query-failed");
    expect(error2.meta["reason"]).toBe("connection-failed");
    expect(Object.isFrozen(error1.meta)).toBe(true);
    expect(Object.isFrozen(error2.meta)).toBe(true);
  });
});
