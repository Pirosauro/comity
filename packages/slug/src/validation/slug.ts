import { z } from "zod";
import { SQL } from "drizzle-orm";

/**
 * Slug status enumeration schema
 */
export const slugStatusSchema = z.enum(["active", "inactive"]);

/**
 * Slug ID parameter validation schema
 */
export const slugIdSchema = z.uuid({
  message: "Slug ID must be a valid UUID",
});

/**
 * Slug source parameter validation schema
 */
export const slugSourceSchema = z
  .string()
  .min(1, { message: "Source path is required" })
  .max(255, { message: "Source path must be 255 characters or less" });

/**
 * Slug target parameter validation schema
 */
export const slugTargetSchema = z
  .string()
  .min(1, { message: "Target path is required" })
  .max(255, { message: "Target path must be 255 characters or less" });

/**
 * Slug workspaceId parameter validation schema
 */
export const slugWorkspaceIdSchema = z.uuid({
  message: "Workspace ID must be a valid UUID",
});

/**
 * Slug list columns validation schema
 */
export const slugColumnsSchema = z
  .array(
    z.enum([
      "id",
      "workspaceId",
      "source",
      "target",
      "redirect",
      "meta",
      "createdAt",
      "updatedAt",
      "workspace.id",
      "workspace.name",
      "workspace.organizationId",
      "workspace.code",
      "workspace.type",
      "workspace.status",
      "workspace.createdAt",
      "workspace.updatedAt",
      "workspace.deletedAt",
    ])
  )
  .default(["id", "workspaceId", "source", "target", "redirect", "meta"]);

/**
 * Base slug data validation schema
 *
 * @remarks
 * This schema validates the core slug fields:
 * - source: Required string, 1-255 characters
 * - target: Required string, 1-255 characters
 * - status: Must be 'active' or 'inactive', defaults to 'active'
 * - meta: Optional metadata object
 */
export const slugDataSchema = z.object({
  source: slugSourceSchema,
  target: slugTargetSchema,
  status: slugStatusSchema.default("active"),
  meta: z.record(z.string(), z.any()).default({}),
});

/**
 * Slug creation input validation schema
 *
 * @remarks
 * Validates input for creating a new slug:
 * - workspaceId: Required UUID string
 * - All fields from slugDataSchema
 */
export const createSlugInputSchema = slugDataSchema.extend({
  id: slugIdSchema.optional(),
  workspaceId: slugWorkspaceIdSchema,
});

/**
 * Slug update input validation schema
 *
 * @remarks
 * Validates input for updating an existing slug:
 * - All fields are optional for partial updates
 * - workspaceId cannot be changed (not included)
 * - No default values applied for updates
 */
export const updateSlugInputSchema = slugDataSchema.partial().extend({
  id: slugIdSchema,
});

/**
 * Slug deletion input validation schema
 *
 * @remarks
 * Validates input for deleting a slug.
 * Only requires the slug ID.
 */
export const deleteSlugInputSchema = z.object({
  id: slugIdSchema,
});

/**
 * Slug list input validation schema
 *
 * @remarks
 * Validates input for listing slugs with pagination and filtering.
 * All parameters are optional.
 */
export const listSlugInputSchema = z.object({
  columns: slugColumnsSchema,
  filters: z
    .custom<SQL>((f) => typeof f === "object" && f instanceof SQL)
    .optional(),
  page: z
    .number()
    .int({ message: "Page must be an integer" })
    .min(1, { message: "Page must be at least 1" })
    .default(1),
  limit: z
    .number()
    .int({ message: "Limit must be an integer" })
    .min(1, { message: "Limit must be at least 1" })
    .max(100, { message: "Limit cannot exceed 100" })
    .default(100),
});

/**
 * TypeScript types inferred from validation schemas
 */
export type SlugStatus = z.infer<typeof slugStatusSchema>;
export type SlugData = z.infer<typeof slugDataSchema>;
export type SlugId = z.infer<typeof slugIdSchema>;
export type SlugSource = z.infer<typeof slugSourceSchema>;
export type SlugTarget = z.infer<typeof slugTargetSchema>;
export type SlugWorkspaceId = z.infer<typeof slugWorkspaceIdSchema>;
export type SlugColumns = z.infer<typeof slugColumnsSchema>;
export type CreateSlugInput = z.infer<typeof createSlugInputSchema>;
export type UpdateSlugInput = z.infer<typeof updateSlugInputSchema>;
export type DeleteSlugInput = z.infer<typeof deleteSlugInputSchema>;
export type ListSlugInput = z.infer<typeof listSlugInputSchema>;
