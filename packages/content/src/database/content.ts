import { relations } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { channel } from "@comity/channel/database";

export const content = pgTable(
  "content",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    channelId: uuid("channel_id")
      .notNull()
      .references(() => channel.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 64 }).notNull(),
    meta: jsonb("meta").default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex().on(table.channelId, table.name)]
);

export const contentRelations = relations(content, ({ one }) => ({
  channel: one(channel, {
    fields: [content.channelId],
    references: [channel.id],
  }),
}));
