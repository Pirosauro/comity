import { SQL } from "drizzle-orm";
import { z } from "zod";

/**
 * UserActivity validation schemas
 */
export const userActivityIdSchema = z.uuid({
  message: "UserActivity ID must be a valid UUID",
});

export const userActivityColumnsSchema = z
  .array(z.enum(["id", "userId", "activityType", "meta", "createdAt"]))
  .default(["id", "userId", "activityType", "meta"]);

export const userActivityDataSchema = z.object({
  id: userActivityIdSchema.optional(),
  userId: z.uuid(),
  activityType: z.string().min(1),
  meta: z.record(z.string(), z.any()).default({}),
  createdAt: z.date().optional(),
});

export const createUserActivityInputSchema = userActivityDataSchema;
export const deleteUserActivityInputSchema = z.object({
  id: userActivityIdSchema,
});
export const listUserActivityInputSchema = z.object({
  columns: userActivityColumnsSchema,
  filters: z
    .custom<SQL>((f) => typeof f === "object" && f instanceof SQL)
    .optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(100),
});

export type UserActivityId = z.infer<typeof userActivityIdSchema>;
export type UserActivityData = z.infer<typeof userActivityDataSchema>;
export type UserActivityColumns = z.infer<typeof userActivityColumnsSchema>;
export type CreateUserActivityInput = z.infer<
  typeof createUserActivityInputSchema
>;
export type DeleteUserActivityInput = z.infer<
  typeof deleteUserActivityInputSchema
>;
export type ListUserActivityInput = z.infer<typeof listUserActivityInputSchema>;
