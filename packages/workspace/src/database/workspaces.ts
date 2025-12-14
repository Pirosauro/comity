import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 8 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    type: varchar("type", { length: 32 }).notNull(),
    status: varchar("status", {
      length: 16,
      enum: ["active", "inactive", "archived"],
    })
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("uk_workspace_organization_code").on(
      table.organizationId,
      table.code
    ),
    index("idx_workspace_type").on(table.type),
    index("idx_workspace_status").on(table.status),
  ]
);

export const workspaceRelations = relations(workspaces, ({ one }) => ({
  organization: one(organizations, {
    fields: [workspaces.organizationId],
    references: [organizations.id],
  }),
}));

export type WorkspaceColumns = InferSelectModel<typeof workspaces>;
