import { describe, expect, it } from "vitest";

import { SqlError } from "@comity/sql/errors";
import { assertKyselyClient } from "../assert-client.js";

describe("assertKyselyClient", () => {
  it("should not throw for valid Kysely client", () => {
    const validClient = {
      executeQuery: async () => ({ rows: [], numAffectedRows: 0n }),
      transaction: () => ({
        execute: async (fn: (trx: any) => Promise<any>) => {
          const trx = { executeQuery: async () => ({ rows: [], numAffectedRows: 0n }) };
          return await fn(trx);
        },
      }),
    };

    expect(() => assertKyselyClient(validClient)).not.toThrow();
  });

  it("should throw SqlError for null client", () => {
    expect(() => assertKyselyClient(null as any)).toThrow(SqlError);
    expect(() => assertKyselyClient(null as any)).toThrow("The SQL client configuration is invalid");
  });

  it("should throw SqlError for undefined client", () => {
    expect(() => assertKyselyClient(undefined as any)).toThrow(SqlError);
    expect(() => assertKyselyClient(undefined as any)).toThrow("The SQL client configuration is invalid");
  });

  it("should throw SqlError for non-object client", () => {
    expect(() => assertKyselyClient("string" as any)).toThrow(SqlError);
    expect(() => assertKyselyClient(42 as any)).toThrow(SqlError);
  });

  it("should throw SqlError when executeQuery is missing", () => {
    const invalidClient = {
      transaction: () => ({}),
    };

    expect(() => assertKyselyClient(invalidClient as any)).toThrow(SqlError);
    expect(() => assertKyselyClient(invalidClient as any)).toThrow(
      "The SQL client configuration is invalid"
    );
  });

  it("should throw SqlError when executeQuery is not a function", () => {
    const invalidClient = {
      executeQuery: "not a function",
      transaction: () => ({}),
    };

    expect(() => assertKyselyClient(invalidClient as any)).toThrow(SqlError);
    expect(() => assertKyselyClient(invalidClient as any)).toThrow(
      "The SQL client configuration is invalid"
    );
  });

  it("should throw SqlError when transaction is missing", () => {
    const invalidClient = {
      executeQuery: async () => ({}),
    };

    expect(() => assertKyselyClient(invalidClient as any)).toThrow(SqlError);
    expect(() => assertKyselyClient(invalidClient as any)).toThrow(
      "The SQL client configuration is invalid"
    );
  });

  it("should throw SqlError when transaction is not a function", () => {
    const invalidClient = {
      executeQuery: async () => ({}),
      transaction: "not a function",
    };

    expect(() => assertKyselyClient(invalidClient as any)).toThrow(SqlError);
    expect(() => assertKyselyClient(invalidClient as any)).toThrow(
      "The SQL client configuration is invalid"
    );
  });
});