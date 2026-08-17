import { describe, expect, it } from "vitest";

import { SqlError } from "@comity/sql/errors";
import { mapSqlError } from "../map-sql-error.js";

describe("mapSqlError", () => {
  it("should map AbortError to cancelled", () => {
    const cause = new DOMException("Aborted", "AbortError");

    const error = mapSqlError(cause, "query", "postgres");

    expect(error).toBeInstanceOf(SqlError);
    expect(error.meta.reason).toBe("cancelled");
    expect(error.meta.details?.retriable).toBe(true);
    expect(error.cause).toBe(cause);
  });

  it("should map postgres 57014 to cancelled", () => {
    const cause = { code: "57014" };

    const error = mapSqlError(cause, "query", "postgres");

    expect(error.meta.reason).toBe("cancelled");
    expect(error.meta.details?.retriable).toBe(true);
    expect(error.meta.context).toEqual({ originalCode: "57014" });
  });

  it("should map postgres 42601 to invalid_query", () => {
    const error = mapSqlError({ code: "42601" }, "query", "postgres");

    expect(error.meta.reason).toBe("invalid_query");
    expect(error.meta.details?.retriable).toBe(false);
  });

  it("should map postgres 08006 to connection_failed", () => {
    const error = mapSqlError({ code: "08006" }, "query", "postgres");

    expect(error.meta.reason).toBe("connection_failed");
    expect(error.meta.details?.retriable).toBe(true);
  });

  it("should map postgres 42883 to invalid_query", () => {
    const error = mapSqlError({ code: "42883" }, "query", "postgres");

    expect(error.meta.reason).toBe("invalid_query");
  });

  it("should map mysql 1317 to cancelled", () => {
    const error = mapSqlError({ code: "1317" }, "query", "mysql");

    expect(error.meta.reason).toBe("cancelled");
    expect(error.meta.details?.retriable).toBe(true);
  });

  it("should map mysql 1064 to invalid_query", () => {
    const error = mapSqlError({ code: "1064" }, "query", "mysql");

    expect(error.meta.reason).toBe("invalid_query");
    expect(error.meta.details?.retriable).toBe(false);
  });

  it("should fall back to query_failed for unknown errors during a query", () => {
    const cause = new Error("boom");

    const error = mapSqlError(cause, "query", "postgres");

    expect(error.meta.reason).toBe("query_failed");
    expect(error.meta.details?.retriable).toBe(false);
    expect(error.cause).toBe(cause);
  });

  it("should fall back to transaction_failed for unknown errors during a transaction", () => {
    const cause = new Error("boom");

    const error = mapSqlError(cause, "transaction", "postgres");

    expect(error.meta.reason).toBe("transaction_failed");
    expect(error.meta.details?.operation).toBe("transaction");
    expect(error.meta.details?.retriable).toBe(false);
  });

  it("should fall back to query_failed for unknown adapters", () => {
    const error = mapSqlError({ code: "57014" }, "query", "unknown-adapter");

    expect(error.meta.reason).toBe("query_failed");
  });

  it("should ignore non-string error codes", () => {
    const error = mapSqlError({ code: 57014 }, "query", "postgres");

    expect(error.meta.reason).toBe("query_failed");
  });

  it("should ignore unmapped driver codes", () => {
    const error = mapSqlError({ code: "99999" }, "query", "postgres");

    expect(error.meta.reason).toBe("query_failed");
  });

  it("should fall back to query_failed for null causes", () => {
    const error = mapSqlError(null, "query", "postgres");

    expect(error.meta.reason).toBe("query_failed");
  });

  it("should map connect operations with the operation preserved", () => {
    const cause = { code: "08006" };

    const error = mapSqlError(cause, "connect", "postgres");

    expect(error.meta.reason).toBe("connection_failed");
    expect(error.meta.details?.operation).toBe("connect");
  });
});