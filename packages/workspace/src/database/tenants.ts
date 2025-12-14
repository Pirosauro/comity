import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  check,
  index,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    status: varchar("status", {
      length: 16,
      enum: ["active", "inactive", "suspended"],
    })
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
    index("idx_tenant_status").on(table.status),
    check(
      "chk_tenant_status",
      sql`status IN ('active', 'inactive', 'suspended')`
    ),
  ]
);

export type TenantColumns = InferSelectModel<typeof tenants>;
