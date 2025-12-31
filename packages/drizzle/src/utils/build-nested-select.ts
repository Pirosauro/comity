import type { Table } from "drizzle-orm";
import type { NormalizedRelation } from "./types.js";

type BuildResult = {
  select: Record<string, unknown>;
  joins: Set<string>;
};

export function buildNestedSelect(
  columns: string[],
  root: Table,
  relations: Record<string, NormalizedRelation>
): BuildResult {
  const select: Record<string, unknown> = {};
  const joins = new Set<string>();

  for (const column of columns) {
    const parts = column.split(".");

    let currentSelect = select;
    let currentTable: Table = root;
    let currentRelations = relations;
    let currentPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;

      // Las
      if (i === parts.length - 1) {
        currentSelect[part] = (currentTable as any)[part];
        break;
      }

      // Nested relation
      const relation = currentRelations[part];

      if (!relation) break;

      currentPath = currentPath ? `${currentPath}.${part}` : part;

      joins.add(currentPath);

      currentSelect[part] ??= {};
      currentSelect = currentSelect[part] as Record<string, unknown>;
      currentTable = relation.table;
      currentRelations = relation.relations;
    }
  }

  // fallback: select *
  if (Object.keys(select).length === 0) {
    Object.assign(select, root);
  }

  return { select, joins };
}
