import type { InferSelectModel } from "drizzle-orm";
import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants.js";

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 8 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    status: varchar("status", { length: 16, enum: ["active", "inactive"] })
      .notNull()
      .default("active"),
    meta: jsonb("meta").default({}),
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
    index("idx_organization_tenant_id").on(table.tenantId),
    uniqueIndex("uk_organization_tenant_code").on(table.tenantId, table.code),
    index("idx_organization_status").on(table.status),
    check("chk_organization_status", sql`status IN ('active', 'inactive')`),
  ]
);

export const organizationRelations = relations(organizations, ({ one }) => ({
  tenant: one(tenants, {
    fields: [organizations.tenantId],
    references: [tenants.id],
  }),
}));

export type OrganizationColumns = InferSelectModel<typeof organizations>;
