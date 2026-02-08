import { describe, expect, it } from "vitest";

import { SqlError } from "../../errors/error.js";
import { failure } from "../../helpers/failure.js";

describe("failure", () => {
  // Create a concrete SqlError for testing
  class TestSqlError extends SqlError {
    readonly code = "sql:test";
  }

  it("should create failure envelope with error", () => {
    const error = new TestSqlError("Test error", { reason: "query-failed" });
    const result = failure(error);

    expect(result.success).toBe(false);
    expect(result.error).toBe(error);
  });

  it("should preserve error instance", () => {
    const error = new TestSqlError("Database error", {
      reason: "connection-failed",
    });
    const result = failure(error);

    expect(result.error === error).toBe(true);
  });

  it("should work with different error reasons", () => {
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
      const result = failure(error);

      expect(result.success).toBe(false);
      expect(result.error.meta["reason"]).toBe(reason);
    }
  });

  it("should preserve error metadata", () => {
    const error = new TestSqlError("Query error", {
      reason: "invalid-query",
      operation: "query",
      adapter: "postgres",
      detail: "42601",
      retriable: false,
    });
    const result = failure(error);

    expect(result.error.meta["reason"]).toBe("invalid-query");
    expect(result.error.meta["operation"]).toBe("query");
    expect(result.error.meta["adapter"]).toBe("postgres");
    expect(result.error.meta["detail"]).toBe("42601");
    expect(result.error.meta["retriable"]).toBe(false);
  });

  it("should preserve error message", () => {
    const errorMessage = "Unexpected database error";
    const error = new TestSqlError(errorMessage, { reason: "query-failed" });
    const result = failure(error);

    expect(result.error.message).toBe(errorMessage);
  });

  it("should preserve error code", () => {
    const error = new TestSqlError("Error", { reason: "query-failed" });
    const result = failure(error);

    expect(result.error.code).toBe("sql:test");
  });

  it("should preserve error cause", () => {
    const originalError = new Error("Original error");
    const error = new TestSqlError("Wrapped error", {
      reason: "query-failed",
      cause: originalError,
    });
    const result = failure(error);

    expect(result.error.cause).toBe(originalError);
  });

  it("should work with errors that have no optional metadata", () => {
    const error = new TestSqlError("Minimal error", { reason: "query-failed" });
    const result = failure(error);

    expect(result.error.meta["operation"]).toBeUndefined();
    expect(result.error.meta["adapter"]).toBeUndefined();
  });

  it("should handle errors with additional metadata", () => {
    const error = new TestSqlError("Complex error", {
      reason: "transaction-failed",
      operation: "transaction",
      adapter: "mysql",
      retriable: true,
      detail: 1040,
    });
    const result = failure(error);

    expect(result.success).toBe(false);
    expect(result.error.meta["reason"]).toBe("transaction-failed");
    expect(result.error.meta["operation"]).toBe("transaction");
    expect(result.error.meta["adapter"]).toBe("mysql");
    expect(result.error.meta["retriable"]).toBe(true);
    expect(result.error.meta["detail"]).toBe(1040);
  });

  it("should preserve timeout errors", () => {
    const error = new TestSqlError("Operation timeout", {
      reason: "timeout",
      retriable: true,
    });
    const result = failure(error);

    expect(result.error.meta["reason"]).toBe("timeout");
    expect(result.error.meta["retriable"]).toBe(true);
  });

  it("should preserve cancellation errors", () => {
    const error = new TestSqlError("Operation cancelled", {
      reason: "cancelled",
      retriable: true,
    });
    const result = failure(error);

    expect(result.error.meta["reason"]).toBe("cancelled");
  });
});
