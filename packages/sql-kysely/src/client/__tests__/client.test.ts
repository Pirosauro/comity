import { describe, expect, it } from "vitest";
import { createKyselySqlClient } from "../create-kysely.js";

type Row = { id: number; name?: string };

class FakeTx<DB> {
  constructor(private rows: Row[]) {}
  async executeQuery(_compiled: unknown): Promise<{ rows: Row[]; numAffectedRows?: bigint }> {
    return { rows: this.rows };
  }
}

class FakeKysely<DB> {
  constructor(
    private rows: Row[],
    private affected?: bigint
  ) {}

  async executeQuery(_query: unknown) {
    return { rows: this.rows, numAffectedRows: this.affected };
  }

  transaction() {
    return {
      execute: async <T>(fn: (trx: any) => Promise<T>): Promise<T> => {
        const trx = new FakeTx<DB>(this.rows);

        return await fn(trx);
      },
    };
  }
}

describe("@comity/sql-kysely", () => {
  it("returns success for simple query with rowCount fallback", async () => {
    const db = new FakeKysely([{ id: 1 }]);
    // @ts-expect-error
    const sql = createKyselySqlClient({ db, adapter: "kysely" });

    const res = await sql.query<Row>({ statement: "select 1", params: [] });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.value.rows).toEqual([{ id: 1 }]);
      expect(res.value.rowCount).toBe(1);
    }
  });

  it("fails for named parameters", async () => {
    const db = new FakeKysely([]);
    // @ts-expect-error
    const sql = createKyselySqlClient({ db, adapter: "kysely" });

    const res = await sql.query<Row>({ statement: "select 1", params: { id: 1 } as any });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.meta["reason"]).toBe("invalid_query");
    }
  });

  it("supports transaction commit", async () => {
    const db = new FakeKysely([{ id: 2 }], BigInt(1));
    // @ts-expect-error
    const sql = createKyselySqlClient({ db, adapter: "kysely" });
    const txRes = await sql.begin();

    expect(txRes.success).toBe(true);

    if (txRes.success) {
      const qRes = await txRes.value.query<Row>({ statement: "select 2", params: [] });

      expect(qRes.success).toBe(true);

      if (qRes.success) {
        expect(qRes.value.rowCount).toBe(1);
      }

      const commitRes = await txRes.value.commit();

      expect(commitRes.success).toBe(true);
    }
  });
});
