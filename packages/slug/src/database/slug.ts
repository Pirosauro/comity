import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  integer,
  json,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { workspaces } from "@comity/workspace/database";

/**
 * Represents a route in the system, which can be localized and associated with various targets.
 * This table is used to manage routes for different languages and slugs.
 */
export const slugs = pgTable(
  "slug",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }), // The workspace this slug belongs to
    source: varchar("source", { length: 255 }).notNull(), // The original path or slug
    target: varchar("target", { length: 255 }).notNull(), // The target path or slug
    redirect: integer("redirect").notNull().default(0), // 0: no redirect, 1: permanent, 2: temporary
    meta: json("meta").default({}), // Additional metadata for the slug, e.g., SEO data
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex().on(table.workspaceId, table.source),
    index().on(table.target),
  ]
);

export type SlugColumns = InferSelectModel<typeof slugs>;
