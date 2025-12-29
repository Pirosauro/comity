import { SQL } from "drizzle-orm";
import { z } from "zod";

/**
 * User ID and Role ID validation schemas
 */
export const userIdSchema = z.uuid({ message: "User ID must be a valid UUID" });

/**
 * Role ID validation schema
 */
export const roleIdSchema = z.uuid({ message: "Role ID must be a valid UUID" });

/**
 * UserRole validation schemas
 */
export const userRoleIdSchema = z.object({
  userId: userIdSchema,
  roleId: roleIdSchema,
});

export const userRoleColumnsSchema = z
  .array(
    z.enum([
      "userId",
      "roleId",
      "role.id",
      "role.channelId",
      "role.name",
      "role.description",
      "role.rules",
      "role.createdAt",
      "role.updatedAt",
      "user.id",
      "user.identifier",
      "user.provider",
      "user.name",
      "user.status",
      "user.email",
      "user.phone",
      "user.meta",
      "user.createdAt",
      "user.updatedAt",
    ])
  )
  .default(["userId", "roleId"]);

export const userRoleDataSchema = z.object({
  userId: userIdSchema,
  roleId: roleIdSchema,
});

export const createUserRoleInputSchema = userRoleDataSchema;
export const deleteUserRoleInputSchema = userRoleIdSchema;
export const listUserRoleInputSchema = z.object({
  columns: userRoleColumnsSchema,
  filters: z
    .custom<SQL>((f) => typeof f === "object" && f instanceof SQL)
    .optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(100),
});

export type UserRoleId = z.infer<typeof userRoleIdSchema>;
export type UserRoleData = z.infer<typeof userRoleDataSchema>;
export type UserRoleColumns = z.infer<typeof userRoleColumnsSchema>;
export type CreateUserRoleInput = z.infer<typeof createUserRoleInputSchema>;
export type DeleteUserRoleInput = z.infer<typeof deleteUserRoleInputSchema>;
export type ListUserRoleInput = z.infer<typeof listUserRoleInputSchema>;
