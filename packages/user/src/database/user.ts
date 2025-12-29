import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
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

export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: varchar("identifier", { length: 255 }).notNull(), // external ID from OAuth provider
    provider: varchar("provider", { length: 32 }).notNull(), // Identity provider ('facebook', 'google', ...)
    name: varchar("name", { length: 64 }), // Full name separated by "/"
    email: varchar("email", { length: 128 }), // Email address
    phone: varchar("phone", { length: 24 }), // Mobile phone number store in E.164
    status: varchar("status", {
      length: 16,
      enum: ["active", "inactive", "pending", "suspended", "deleted"],
    })
      .notNull()
      .default("pending"), // Start with pending for email verification
    meta: jsonb("meta").default({}), // Additional metadata as JSONB
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex().on(table.identifier, table.provider),
    index().on(table.email),
    index().on(table.phone),
    index().on(table.status),
    check(
      "user_status_check",
      sql`status IN ('active', 'inactive', 'pending', 'suspended', 'deleted')`
    ),
  ]
);

export type UserColumns = InferSelectModel<typeof user>;
