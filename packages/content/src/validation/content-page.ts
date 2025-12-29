import { z } from "zod";
import { SQL } from "drizzle-orm";

export const contentPageIdSchema = z.uuid({
  message: "ContentPage ID must be a valid UUID",
});

export const contentPageColumnsSchema = z
  .array(
    z.enum([
      "id",
      "contentId",
      "meta",
      "createdAt",
      "updatedAt",
      "content.id",
      "content.name",
    ])
  )
  .default(["id", "contentId", "meta"]);

export const contentPageDataSchema = z.object({
  meta: z.record(z.string(), z.any()).optional().default({}),
});

export const createContentPageInputSchema = z.object({
  id: contentPageIdSchema.optional(),
  contentId: z.uuid({ message: "Content ID must be a valid UUID" }),
  meta: z.record(z.string(), z.any()).optional().default({}),
});

export const updateContentPageInputSchema = contentPageDataSchema
  .partial()
  .extend({ id: contentPageIdSchema });

export const deleteContentPageInputSchema = z.object({
  id: contentPageIdSchema,
});

export const listContentPageInputSchema = z.object({
  columns: contentPageColumnsSchema,
  filters: z
    .custom<SQL>((f) => typeof f === "object" && f instanceof SQL)
    .optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(100),
});

export type ContentPageId = z.infer<typeof contentPageIdSchema>;
export type CreateContentPageInput = z.infer<
  typeof createContentPageInputSchema
>;
export type UpdateContentPageInput = z.infer<
  typeof updateContentPageInputSchema
>;
export type DeleteContentPageInput = z.infer<
  typeof deleteContentPageInputSchema
>;
export type ListContentPageInput = z.infer<typeof listContentPageInputSchema>;
