import type { InferSelectModel } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const role = pgTable(
  "role",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull(),
    name: varchar("name", { length: 32 }).notNull(),
    description: varchar("description", { length: 255 }),
    rules: jsonb("rules").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex().on(table.name, table.channelId),
    index().on(table.channelId),
  ]
);

export type RoleColumns = InferSelectModel<typeof role>;
