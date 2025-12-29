import { SQL } from "drizzle-orm";
import { z } from "zod";

/**
 * User status enumeration schema
 */
export const userStatusSchema = z.enum([
  "active",
  "inactive",
  "pending",
  "suspended",
  "deleted",
]);

/**
 * User ID parameter validation schema
 */
export const userIdSchema = z.uuid({ message: "User ID must be a valid UUID" });

/**
 * User identifier parameter validation schema
 */
export const userIdentifierSchema = z
  .string()
  .min(1, { message: "User identifier is required" })
  .max(255);

/**
 * User provider parameter validation schema
 */
export const userProviderSchema = z
  .string()
  .min(1, { message: "User provider is required" })
  .max(32);

/**
 * User list columns validation schema
 */
export const userColumnsSchema = z
  .array(
    z.enum([
      "id",
      "identifier",
      "provider",
      "name",
      "status",
      "email",
      "phone",
      "meta",
      "createdAt",
      "updatedAt",
    ])
  )
  .default([
    "id",
    "identifier",
    "provider",
    "name",
    "status",
    "email",
    "phone",
    "meta",
  ]);

/**
 * Base user data validation schema
 */
export const userDataSchema = z.object({
  identifier: userIdentifierSchema,
  provider: userProviderSchema,
  name: z.string().max(64).optional(),
  status: userStatusSchema.default("pending"),
  email: z.email().max(128).optional(),
  phone: z.e164().optional(),
  meta: z.record(z.string(), z.any()).default({}),
});

/**
 * User creation input validation schema
 */
export const createUserInputSchema = userDataSchema.extend({
  id: userIdSchema.optional(),
});

/**
 * User update input validation schema
 */
export const updateUserInputSchema = userDataSchema.partial().extend({
  id: userIdSchema,
});

/**
 * User deletion input validation schema
 */
export const deleteUserInputSchema = z.object({
  id: userIdSchema,
});

/**
 * User list input validation schema
 */
export const listUserInputSchema = z.object({
  columns: userColumnsSchema,
  filters: z
    .custom<SQL>((f) => typeof f === "object" && f instanceof SQL)
    .optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(100),
});

/**
 * TypeScript types inferred from validation schemas
 */
export type UserStatus = z.infer<typeof userStatusSchema>;
export type UserData = z.infer<typeof userDataSchema>;
export type UserId = z.infer<typeof userIdSchema>;
export type UserIdentifier = z.infer<typeof userIdentifierSchema>;
export type UserProvider = z.infer<typeof userProviderSchema>;
export type UserColumns = z.infer<typeof userColumnsSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserInputSchema>;
export type ListUserInput = z.infer<typeof listUserInputSchema>;
