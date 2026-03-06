import { describe, expect, it } from "vitest";

import { mapSqlError } from "../map-sql-error.js";

describe("mapSqlError", () => {
  const adapter = "test-adapter";

  describe("AbortError handling", () => {
    it("should map DOMException AbortError to cancelled", () => {
      const cause = new DOMException("Aborted", "AbortError");
      const result = mapSqlError(cause, "query", adapter);

      expect(result.code).toBe("sql:kysely_adapter");
      expect(result.message).toBe("Operation cancelled");
      expect(result.meta["reason"]).toBe("cancelled");
      expect(result.meta["retriable"]).toBe(true);
      expect(result.meta["adapter"]).toBe(adapter);
      expect(result.meta["operation"]).toBe("query");
      expect(result.cause).toBe(cause);
    });
  });

  describe("Postgres error code handling", () => {
    const pgAdapter = "pg";

    it("should map code 57014 to cancelled", () => {
      const cause = { code: "57014", message: "cancelled" };
      const result = mapSqlError(cause, "query", pgAdapter);

      expect(result.message).toBe("Operation cancelled");
      expect(result.meta["reason"]).toBe("cancelled");
      expect(result.meta["retriable"]).toBe(true);
      expect(result.meta["detail"]).toBe("57014");
      expect(result.cause).toBe(cause);
    });

    it("should map code 42601 to invalid-query", () => {
      const cause = { code: "42601", message: "syntax error" };
      const result = mapSqlError(cause, "query", pgAdapter);

      expect(result.message).toBe("Invalid SQL query");
      expect(result.meta["reason"]).toBe("invalid-query");
      expect(result.meta["retriable"]).toBe(false);
      expect(result.meta["detail"]).toBe("42601");
      expect(result.cause).toBe(cause);
    });

    it("should map code 08006 to connection-failed", () => {
      const cause = { code: "08006", message: "connection failed" };
      const result = mapSqlError(cause, "query", pgAdapter);

      expect(result.message).toBe("Database connection failed");
      expect(result.meta["reason"]).toBe("connection-failed");
      expect(result.meta["retriable"]).toBe(true);
      expect(result.meta["detail"]).toBe("08006");
      expect(result.cause).toBe(cause);
    });
  });

  describe("operation-aware fallback", () => {
    it("should map transaction operation to transaction-failed", () => {
      const cause = new Error("some transaction error");
      const result = mapSqlError(cause, "transaction", adapter);

      expect(result.message).toBe("Transaction failed");
      expect(result.meta["reason"]).toBe("transaction-failed");
      expect(result.meta["retriable"]).toBe(false);
      expect(result.meta["operation"]).toBe("transaction");
    });
  });

  describe("general fallback", () => {
    it("should map query operation to query-failed", () => {
      const cause = new Error("some query error");
      const result = mapSqlError(cause, "query", adapter);

      expect(result.message).toBe("Query failed");
      expect(result.meta["reason"]).toBe("query-failed");
      expect(result.meta["retriable"]).toBe(false);
      expect(result.meta["operation"]).toBe("query");
    });

    it("should map connect operation to query-failed", () => {
      const cause = new Error("some connect error");
      const result = mapSqlError(cause, "connect", adapter);

      expect(result.message).toBe("Query failed");
      expect(result.meta["reason"]).toBe("query-failed");
      expect(result.meta["retriable"]).toBe(false);
      expect(result.meta["operation"]).toBe("connect");
    });
  });

  describe("unknown error types", () => {
    it("should handle string errors", () => {
      const cause = "string error";
      const result = mapSqlError(cause, "query", adapter);

      expect(result.message).toBe("Query failed");
      expect(result.cause).toBe(cause);
    });

    it("should handle null/undefined", () => {
      const result = mapSqlError(null, "query", adapter);

      expect(result.message).toBe("Query failed");
      expect(result.cause).toBeUndefined();
    });

    it("should handle objects without code property", () => {
      const cause = { message: "some error", other: "prop" };
      const result = mapSqlError(cause, "query", adapter);

      expect(result.message).toBe("Query failed");
      expect(result.cause).toBe(cause);
    });
  });
});
