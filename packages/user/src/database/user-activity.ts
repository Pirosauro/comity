import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const userActivity = pgTable(
  "user_activity",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 32 }).notNull(), // e.g., 'login', 'logout', 'password_change'
    ipHash: varchar("ip_hash", { length: 64 }), // Privacy compliant hash of the IP address
    meta: jsonb("meta").default({}), // Additional metadata as JSONB
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.type),
    index().on(table.createdAt),
  ]
);

export type UserActivityColumns = InferSelectModel<typeof userActivity>;
