import { describe, expect, it, vi } from "vitest";

import type { SqlQuery } from "@comity/sql";

import { SqlError } from "@comity/sql/errors";
import { executeQuery } from "../execute.js";

describe("executeQuery", () => {
  const adapter = "test-adapter";

  it("should execute successful query and return result", async () => {
    const mockDb = {
      executeQuery: vi.fn().mockResolvedValue({
        rows: [{ id: 1, name: "test" }],
        numAffectedRows: 1n,
      }),
    };

    const query: SqlQuery = {
      statement: "SELECT * FROM users",
    };

    const result = await executeQuery(mockDb as any, query, adapter);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value).toEqual({
        rows: [{ id: 1, name: "test" }],
        rowCount: 1,
      });
    }

    expect(mockDb.executeQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: "SELECT * FROM users",
        parameters: [],
      })
    );
  });

  it("should handle bigint numAffectedRows", async () => {
    const mockDb = {
      executeQuery: vi.fn().mockResolvedValue({
        rows: [],
        numAffectedRows: 42n,
      }),
    };

    const query: SqlQuery = {
      statement: "UPDATE users SET active = 1",
    };

    const result = await executeQuery(mockDb as any, query, adapter);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value.rowCount).toBe(42);
    }
  });

  it("should handle queries without numAffectedRows (use rows length)", async () => {
    const mockDb = {
      executeQuery: vi.fn().mockResolvedValue({
        rows: [{ id: 1 }, { id: 2 }],
        numAffectedRows: undefined,
      }),
    };

    const query: SqlQuery = {
      statement: "SELECT * FROM users",
    };

    const result = await executeQuery(mockDb as any, query, adapter);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.value.rowCount).toBe(2);
    }
  });

  it("should handle queries with array params", async () => {
    const mockDb = {
      executeQuery: vi.fn().mockResolvedValue({
        rows: [{ id: 1 }],
        numAffectedRows: 1n,
      }),
    };

    const query: SqlQuery = {
      statement: "SELECT * FROM users WHERE id = ?",
      params: [1],
    };

    const result = await executeQuery(mockDb as any, query, adapter);

    expect(result.success).toBe(true);
    expect(mockDb.executeQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: "SELECT * FROM users WHERE id = ?",
        parameters: [1],
      })
    );
  });

  it("should return error for named params", async () => {
    const mockDb = {
      executeQuery: vi.fn(),
    };

    const query: SqlQuery = {
      statement: "SELECT * FROM users WHERE id = :id",
      params: { id: 1 },
    };

    const result = await executeQuery(mockDb as any, query, adapter);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toBeInstanceOf(SqlError);
      expect(result.error.meta["reason"]).toBe("invalid_query");
      expect(result.error.meta["details"]?.["retriable"]).toBe(false);
    }

    expect(mockDb.executeQuery).not.toHaveBeenCalled();
  });

  it("should map execution errors", async () => {
    const executionError = new Error("Database connection failed");
    const mockDb = {
      executeQuery: vi.fn().mockRejectedValue(executionError),
    };

    const query: SqlQuery = {
      statement: "SELECT * FROM users",
    };

    const result = await executeQuery(mockDb as any, query, adapter);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toBeInstanceOf(SqlError);
      expect(result.error.meta["reason"]).toBe("query_failed");
      expect(result.error.cause).toBe(executionError);
    }
  });

  it("should handle DOMException errors during execution", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    const mockDb = {
      executeQuery: vi.fn().mockRejectedValue(abortError),
    };

    const query: SqlQuery = {
      statement: "SELECT * FROM users",
    };

    const result = await executeQuery(mockDb as any, query, adapter);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error).toBeInstanceOf(SqlError);
      expect(result.error.meta["reason"]).toBe("cancelled");
      expect(result.error.meta["details"]?.["retriable"]).toBe(true);
    }
  });
});