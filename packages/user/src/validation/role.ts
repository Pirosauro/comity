import { SQL } from "drizzle-orm";
import { z } from "zod";

/**
 * Role validation schemas
 */
export const roleIdSchema = z.uuid({ message: "Role ID must be a valid UUID" });

export const channelIdSchema = z.uuid({
  message: "Channel ID must be a valid UUID",
});

export const roleColumnsSchema = z
  .array(
    z.enum([
      "id",
      "channelId",
      "name",
      "description",
      "rules",
      "createdAt",
      "updatedAt",
    ])
  )
  .default(["id", "channelId", "name", "description", "rules"]);

export const roleDataSchema = z.object({
  id: roleIdSchema.optional(),
  channelId: channelIdSchema,
  name: z.string().min(1).max(32),
  description: z.string().max(255).optional(),
  rules: z.record(z.string(), z.any()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createRoleInputSchema = roleDataSchema;
export const updateRoleInputSchema = roleDataSchema
  .partial()
  .extend({ id: roleIdSchema });
export const deleteRoleInputSchema = z.object({ id: roleIdSchema });
export const listRoleInputSchema = z.object({
  columns: roleColumnsSchema,
  filters: z
    .custom<SQL>((f) => typeof f === "object" && f instanceof SQL)
    .optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(100),
});

export type RoleId = z.infer<typeof roleIdSchema>;
export type ChannelId = z.infer<typeof channelIdSchema>;
export type RoleData = z.infer<typeof roleDataSchema>;
export type RoleColumns = z.infer<typeof roleColumnsSchema>;
export type CreateRoleInput = z.infer<typeof createRoleInputSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleInputSchema>;
export type DeleteRoleInput = z.infer<typeof deleteRoleInputSchema>;
export type ListRoleInput = z.infer<typeof listRoleInputSchema>;
