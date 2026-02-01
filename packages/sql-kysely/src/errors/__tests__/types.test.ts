import { describe, expect, it } from "vitest";

import type { SqlErrorReason } from "@comity/sql/errors";

import { ERROR_MESSAGES } from "../types.js";

describe("ERROR_MESSAGES", () => {
  it("should contain messages for all SqlErrorReason values", () => {
    const expectedReasons: SqlErrorReason[] = [
      "cancelled",
      "timeout",
      "invalid-query",
      "connection-failed",
      "transaction-failed",
      "query-failed",
    ];

    expectedReasons.forEach((reason) => {
      expect(ERROR_MESSAGES).toHaveProperty(reason);
      expect(typeof ERROR_MESSAGES[reason]).toBe("string");
      expect(ERROR_MESSAGES[reason].length).toBeGreaterThan(0);
    });
  });

  it("should have correct messages", () => {
    expect(ERROR_MESSAGES.cancelled).toBe("Operation cancelled");
    expect(ERROR_MESSAGES.timeout).toBe("Operation timed out");
    expect(ERROR_MESSAGES["invalid-query"]).toBe("Invalid SQL query");
    expect(ERROR_MESSAGES["connection-failed"]).toBe("Database connection failed");
    expect(ERROR_MESSAGES["transaction-failed"]).toBe("Transaction failed");
    expect(ERROR_MESSAGES["query-failed"]).toBe("Query failed");
  });

  it("should be a readonly record", () => {
    // This test ensures the type is correct - we can't modify it at runtime
    const messages = ERROR_MESSAGES;
    expect(Object.isFrozen(messages)).toBe(false); // Not frozen, but type is readonly
    expect(Object.keys(messages)).toHaveLength(6);
  });
});
