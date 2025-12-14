import { SQL } from "drizzle-orm";
import { z } from "zod";
import { tenantIdSchema } from "./tenant.js";

/**
 * Organization status enumeration schema
 */
export const organizationStatusSchema = z.enum(["active", "inactive"]);

/**
 * Organization ID parameter validation schema
 */
export const organizationIdSchema = z.uuid({
  message: "Organization ID must be a valid UUID",
});

/**
 * Organization code validation schema
 */
export const organizationCodeSchema = z
  .string()
  .min(1, { message: "Organization code is required" })
  .max(8, { message: "Organization code must be 8 characters or less" })
  .regex(/^[A-Z0-9]+$/, {
    message: "Organization code can only contain capital letters and numbers",
  });

/**
 * Organization list columns validation schema
 */
export const organizationColumnsSchema = z
  .array(
    z.enum([
      "id",
      "tenantId",
      "code",
      "name",
      "status",
      "meta",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ])
  )
  .default(["id", "tenantId", "code", "name", "status", "meta"]);

/**
 * Base organization data validation schema
 */
export const organizationDataSchema = z.object({
  tenantId: tenantIdSchema,
  code: organizationCodeSchema,
  name: z.string().max(255, {
    message: "Organization name must be 255 characters or less",
  }),
  status: organizationStatusSchema.default("active"),
  meta: z.record(z.string(), z.any()).default({}),
});

/**
 * Organization creation input validation schema
 */
export const createOrganizationInputSchema = organizationDataSchema.extend({
  id: organizationIdSchema.optional(),
});

/**
 * Organization update input validation schema
 */
export const updateOrganizationInputSchema = organizationDataSchema
  .partial()
  .extend({
    id: organizationIdSchema,
  });

/**
 * Organization deletion input validation schema
 */
export const deleteOrganizationInputSchema = z.object({
  id: organizationIdSchema,
});

/**
 * Organization list input validation schema
 */
export const listOrganizationInputSchema = z.object({
  columns: organizationColumnsSchema,
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
export type OrganizationStatus = z.infer<typeof organizationStatusSchema>;
export type OrganizationData = z.infer<typeof organizationDataSchema>;
export type OrganizationId = z.infer<typeof organizationIdSchema>;
export type OrganizationCode = z.infer<typeof organizationCodeSchema>;
export type OrganizationColumns = z.infer<typeof organizationColumnsSchema>;
export type CreateOrganizationInput = z.infer<
  typeof createOrganizationInputSchema
>;
export type UpdateOrganizationInput = z.infer<
  typeof updateOrganizationInputSchema
>;
export type DeleteOrganizationInput = z.infer<
  typeof deleteOrganizationInputSchema
>;
export type ListOrganizationInput = z.infer<typeof listOrganizationInputSchema>;
