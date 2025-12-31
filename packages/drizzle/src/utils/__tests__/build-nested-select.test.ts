import { describe, it, expect } from "vitest";
import { buildNestedSelect } from "../build-nested-select.js";

describe("buildNestedSelect", () => {
  const root = { id: "id_col", title: "title_col" } as any;

  it("should fallback to selecting root when columns empty", () => {
    const res = buildNestedSelect([], root, {});
    expect(res.select).toEqual(root);
    expect(res.joins.size).toBe(0);
  });

  it("should build nested selects and joins for dotted columns", () => {
    const relations = {
      author: {
        table: { name: "author_name" } as any,
        relations: {},
      },
    } as any;

    const res = buildNestedSelect(["author.name"], root, relations);

    expect((res.select as any).author).toBeDefined();
    expect((res.select as any).author.name).toBe(relations.author.table.name);
    expect(res.joins.has("author")).toBe(true);
  });

  it("should build nested selects and multi-level joins", () => {
    const relations = {
      author: {
        table: { id: 1 } as any,
        relations: {
          profile: {
            table: { bio: "x" } as any,
            relations: {
              address: {
                table: { city: "c" } as any,
                relations: {},
              },
            },
          },
        },
      },
    } as any;

    const res = buildNestedSelect(
      ["author.profile.address.city"],
      root,
      relations
    );

    expect((res.select as any).author).toBeDefined();
    expect((res.select as any).author.profile.address.city).toBe(
      relations.author.relations.profile.relations.address.table.city
    );
    expect(res.joins.has("author")).toBe(true);
    expect(res.joins.has("author.profile")).toBe(true);
  });
});
