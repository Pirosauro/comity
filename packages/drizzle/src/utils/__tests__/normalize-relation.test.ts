import { describe, it, expect } from "vitest";
import { normalizeRelation } from "../normalize-relation.js";

describe("normalizeRelation", () => {
  it("should normalize a simple relation without nested relations", () => {
    const input = { table: { t: "table" } as any } as any;
    const result = normalizeRelation(input);

    expect(result.table).toBe(input.table);
    expect(result.relations).toEqual({});
  });

  it("should normalize nested relations recursively", () => {
    const input = {
      table: { root: true } as any,
      relations: {
        child: {
          table: { child: true } as any,
          relations: {
            grand: { table: { grand: true } as any },
          },
        },
      },
    } as any;

    const result = normalizeRelation(input);

    expect(result.table).toBe(input.table);
    expect(result.relations.child.table).toBe(input.relations.child.table);
    expect(result.relations.child.relations.grand.table).toBe(
      input.relations.child.relations.grand.table
    );
  });
});
