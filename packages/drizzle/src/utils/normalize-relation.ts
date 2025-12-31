import type { NormalizedRelation, RelationDefinition } from "./types.js";

export function normalizeRelation(
  input: RelationDefinition
): NormalizedRelation {
  return {
    table: input.table,
    relations: Object.fromEntries(
      Object.entries(input.relations ?? {}).map(([key, value]) => [
        key,
        normalizeRelation(value),
      ])
    ),
  };
}
