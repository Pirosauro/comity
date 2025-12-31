import type { Table } from "drizzle-orm";

export type RelationDefinition<T extends Table = Table> = {
  table: T;
  relations?: Record<string, RelationDefinition>;
};

export type RelationsInput = Record<string, RelationDefinition>;

export type NormalizedRelation = {
  table: Table;
  relations: Record<string, NormalizedRelation>;
};
