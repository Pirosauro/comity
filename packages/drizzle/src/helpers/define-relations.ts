import type { Table } from "drizzle-orm";
import type {
  NormalizedRelation,
  RelationDefinition,
  RelationsInput,
} from "../utils/types.js";
import { normalizeRelation } from "../utils/normalize-relation.js";

export function defineRelations<T extends Table, R extends RelationsInput>(
  root: T,
  relations: R
): {
  root: T;
  relations: {
    [K in keyof R]: NormalizedRelation;
  };
} {
  return {
    root,
    relations: Object.fromEntries(
      Object.entries(relations).map(([key, value]) => [
        key,
        normalizeRelation(value as RelationDefinition),
      ])
    ) as any,
  };
}
