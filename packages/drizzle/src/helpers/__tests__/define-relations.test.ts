import { describe, it, expect } from "vitest";
import { defineRelations } from "../define-relations.js";

describe("defineRelations", () => {
  it("should attach normalized relations to the returned object", () => {
    const root = { id: "root" } as any;
    const relations = {
      child: { table: { id: "child" } as any },
    } as any;

    const result = defineRelations(root, relations as any);

    expect(result.root).toBe(root);
    expect(result.relations.child.table).toBe(relations.child.table);
  });
});
