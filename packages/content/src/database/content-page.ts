import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { content } from "./content.js";

export const contentPage = pgTable(
  "content_page",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contentId: uuid("content_id")
      .notNull()
      .references(() => content.id),
    locale: varchar("locale", { length: 5 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: jsonb("body").notNull().default([]),
    status: varchar("status", {
      length: 16,
      enum: ["draft", "published", "deleted"],
    }).notNull(),
    meta: jsonb("meta").default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex().on(table.contentId, table.locale),
    index().on(table.status),
  ]
);

export const contentPageDataRelations = relations(contentPage, ({ one }) => ({
  content: one(content, {
    fields: [contentPage.contentId],
    references: [content.id],
  }),
}));
