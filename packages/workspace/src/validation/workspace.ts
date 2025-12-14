import { SQL } from "drizzle-orm";
import { z } from "zod";
import { organizationIdSchema } from "./organization.js";

/**
 * Workspace type enumeration schema
 */
export const workspaceTypeSchema = z
  .string()
  .min(1, { message: "Workspace code is required" })
  .max(32, { message: "Workspace code must be 32 characters or less" })
  .regex(/^[A-Z0-9_-]+$/, {
    message:
      "Workspace code can only contain capital letters, numbers, hyphens, and underscores",
  });

/**
 * Workspace status enumeration schema
 */
export const workspaceStatusSchema = z.enum(["active", "inactive", "archived"]);

/**
 * Workspace ID parameter validation schema
 */
export const workspaceIdSchema = z.uuid({
  message: "Workspace ID must be a valid UUID",
});

/**
 * Workspace code validation schema
 */
export const workspaceCodeSchema = z
  .string()
  .min(1, { message: "Workspace code is required" })
  .max(8, { message: "Workspace code must be 8 characters or less" })
  .regex(/^[A-Z0-9]+$/, {
    message: "Workspace code can only contain capital letters and numbers",
  });

/**
 * Workspace list columns validation schema
 */
export const workspaceColumnsSchema = z
  .array(
    z.enum([
      "id",
      "organizationId",
      "name",
      "code",
      "type",
      "status",
      "createdAt",
      "updatedAt",
      "deletedAt",
      "organization.id",
      "organization.tenantId",
      "organization.code",
      "organization.name",
      "organization.status",
      "organization.meta",
      "organization.createdAt",
      "organization.updatedAt",
      "organization.deletedAt",
      "organization.tenant.id",
      "organization.tenant.name",
      "organization.tenant.status",
      "organization.tenant.meta",
      "organization.tenant.createdAt",
      "organization.tenant.updatedAt",
      "organization.tenant.deletedAt",
    ])
  )
  .default(["id", "organizationId", "name", "code", "type", "status"]);

/**
 * Base workspace data validation schema
 */
export const workspaceDataSchema = z.object({
  organizationId: organizationIdSchema,
  name: z
    .string()
    .min(1, { message: "Workspace name is required" })
    .max(64, { message: "Workspace name must be 64 characters or less" }),
  code: workspaceCodeSchema,
  type: workspaceTypeSchema,
  status: workspaceStatusSchema.default("active"),
});

/**
 * Workspace creation input validation schema
 */
export const createWorkspaceInputSchema = workspaceDataSchema.extend({
  id: workspaceIdSchema.optional(),
});

/**
 * Workspace update input validation schema
 */
export const updateWorkspaceInputSchema = workspaceDataSchema.partial().extend({
  id: workspaceIdSchema,
});

/**
 * Workspace deletion input validation schema
 */
export const deleteWorkspaceInputSchema = z.object({
  id: workspaceIdSchema,
});

/**
 * Workspace list input validation schema
 */
export const listWorkspaceInputSchema = z.object({
  columns: workspaceColumnsSchema,
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
export type WorkspaceType = z.infer<typeof workspaceTypeSchema>;
export type WorkspaceStatus = z.infer<typeof workspaceStatusSchema>;
export type WorkspaceData = z.infer<typeof workspaceDataSchema>;
export type WorkspaceId = z.infer<typeof workspaceIdSchema>;
export type WorkspaceCode = z.infer<typeof workspaceCodeSchema>;
export type WorkspaceColumns = z.infer<typeof workspaceColumnsSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceInputSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceInputSchema>;
export type DeleteWorkspaceInput = z.infer<typeof deleteWorkspaceInputSchema>;
export type ListWorkspaceInput = z.infer<typeof listWorkspaceInputSchema>;
