import type { InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user.js";
import { role } from "./role.js";

export const userRole = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => role.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })]
);

export const userRelations = relations(user, ({ many }) => ({
  userRoles: many(userRole),
}));

export const roleRelations = relations(role, ({ many }) => ({
  userRoles: many(userRole),
}));

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, {
    fields: [userRole.userId],
    references: [user.id],
  }),
  role: one(role, {
    fields: [userRole.roleId],
    references: [role.id],
  }),
}));

export type UserRoleColumns = InferSelectModel<typeof userRole>;
