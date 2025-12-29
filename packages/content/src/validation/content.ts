import { z } from "zod";
import { SQL } from "drizzle-orm";

export const contentIdSchema = z.uuid({
  message: "Content ID must be a valid UUID",
});

export const contentNameSchema = z.string().min(1).max(64);

export const contentColumnsSchema = z
  .array(
    z.enum([
      "id",
      "channelId",
      "name",
      "meta",
      "createdAt",
      "updatedAt",
      "channel.id",
      "channel.name",
      "channel.meta",
    ])
  )
  .default(["id", "channelId", "name", "meta"]);

export const contentDataSchema = z.object({
  name: contentNameSchema,
  // Use record of string->any
  meta: z.record(z.string(), z.any()).optional().default({}),
});

export const createContentInputSchema = contentDataSchema.extend({
  id: contentIdSchema.optional(),
  channelId: z.uuid({ message: "Channel ID must be a valid UUID" }),
});

export const updateContentInputSchema = contentDataSchema.partial().extend({
  id: contentIdSchema,
});

export const deleteContentInputSchema = z.object({ id: contentIdSchema });

export const listContentInputSchema = z.object({
  columns: contentColumnsSchema,
  filters: z
    .custom<SQL>((f) => typeof f === "object" && f instanceof SQL)
    .optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(100),
});

export type ContentId = z.infer<typeof contentIdSchema>;
export type ContentColumns = z.infer<typeof contentColumnsSchema>;
export type CreateContentInput = z.infer<typeof createContentInputSchema>;
export type UpdateContentInput = z.infer<typeof updateContentInputSchema>;
export type DeleteContentInput = z.infer<typeof deleteContentInputSchema>;
export type ListContentInput = z.infer<typeof listContentInputSchema>;
