import { describe, expect, it } from "vitest";

import { KyselySqlError } from "../../errors/kysely.js";
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

  it("should throw KyselySqlError for null client", () => {
    expect(() => assertKyselyClient(null as any)).toThrow(KyselySqlError);
    expect(() => assertKyselyClient(null as any)).toThrow("Invalid configuration");
  });

  it("should throw KyselySqlError for undefined client", () => {
    expect(() => assertKyselyClient(undefined as any)).toThrow(KyselySqlError);
    expect(() => assertKyselyClient(undefined as any)).toThrow("Invalid configuration");
  });

  it("should throw KyselySqlError for non-object client", () => {
    expect(() => assertKyselyClient("string" as any)).toThrow(KyselySqlError);
    expect(() => assertKyselyClient(42 as any)).toThrow(KyselySqlError);
  });

  it("should throw KyselySqlError when executeQuery is missing", () => {
    const invalidClient = {
      transaction: () => ({}),
    };

    expect(() => assertKyselyClient(invalidClient as any)).toThrow(KyselySqlError);
    expect(() => assertKyselyClient(invalidClient as any)).toThrow("Invalid configuration");
  });

  it("should throw KyselySqlError when executeQuery is not a function", () => {
    const invalidClient = {
      executeQuery: "not a function",
      transaction: () => ({}),
    };

    expect(() => assertKyselyClient(invalidClient as any)).toThrow(KyselySqlError);
    expect(() => assertKyselyClient(invalidClient as any)).toThrow("Invalid configuration");
  });

  it("should throw KyselySqlError when transaction is missing", () => {
    const invalidClient = {
      executeQuery: async () => ({}),
    };

    expect(() => assertKyselyClient(invalidClient as any)).toThrow(KyselySqlError);
    expect(() => assertKyselyClient(invalidClient as any)).toThrow("Invalid configuration");
  });

  it("should throw KyselySqlError when transaction is not a function", () => {
    const invalidClient = {
      executeQuery: async () => ({}),
      transaction: "not a function",
    };

    expect(() => assertKyselyClient(invalidClient as any)).toThrow(KyselySqlError);
    expect(() => assertKyselyClient(invalidClient as any)).toThrow("Invalid configuration");
  });
});
