import { SQL } from "drizzle-orm";
import { z } from "zod";

/**
 * Tenant status enumeration schema
 */
export const tenantStatusSchema = z.enum(["active", "inactive", "suspended"]);

/**
 * Tenant ID parameter validation schema
 */
export const tenantIdSchema = z.uuid({
  message: "Tenant ID must be a valid UUID",
});

/**
 * Tenant list columns validation schema
 */
export const tenantColumnsSchema = z
  .array(
    z.enum([
      "id",
      "name",
      "status",
      "meta",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ])
  )
  .default(["id", "name", "status", "meta"]);

/**
 * Base tenant data validation schema
 */
export const tenantDataSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tenant name is required" })
    .max(255, { message: "Tenant name must be 255 characters or less" }),
  status: tenantStatusSchema.default("active"),
  meta: z.record(z.string(), z.any()).default({}),
});

/**
 * Tenant creation input validation schema
 */
export const createTenantInputSchema = tenantDataSchema.extend({
  id: tenantIdSchema.optional(),
});

/**
 * Tenant update input validation schema
 */
export const updateTenantInputSchema = tenantDataSchema.partial().extend({
  id: tenantIdSchema,
});

/**
 * Tenant deletion input validation schema
 */
export const deleteTenantInputSchema = z.object({
  id: tenantIdSchema,
});

/**
 * Tenant list input validation schema
 */
export const listTenantInputSchema = z.object({
  columns: tenantColumnsSchema,
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
export type TenantStatus = z.infer<typeof tenantStatusSchema>;
export type TenantData = z.infer<typeof tenantDataSchema>;
export type TenantId = z.infer<typeof tenantIdSchema>;
export type TenantColumns = z.infer<typeof tenantColumnsSchema>;
export type CreateTenantInput = z.infer<typeof createTenantInputSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantInputSchema>;
export type DeleteTenantInput = z.infer<typeof deleteTenantInputSchema>;
export type ListTenantInput = z.infer<typeof listTenantInputSchema>;
