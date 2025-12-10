import { z } from "zod";

/**
 * Zod schema for validating AuthUser objects.
 *
 * @remarks
 * Ensures that user objects have the required id field and proper structure.
 * Additional fields are allowed through the generic type parameter.
 */
export const AuthUserSchema = z
  .object({
    id: z.string().min(1, "User ID cannot be empty"),
  })
  .passthrough(); // Allow additional properties

/**
 * Zod schema for validating JWTPayload objects.
 *
 * @remarks
 * Validates the structure of JWT payloads including standard claims
 * and the custom user field.
 */
export const JWTPayloadSchema = z
  .object({
    sub: z.string().min(1, "Subject (sub) claim is required").optional(),
    iat: z.number().int().positive().optional(),
    exp: z.number().int().positive().optional(),
    iss: z.string().optional(),
    aud: z.union([z.string(), z.array(z.string())]).optional(),
    verified: z.number().int().positive().optional(),
    user: AuthUserSchema,
  })
  .passthrough(); // Allow additional custom claims

/**
 * Zod schema for validating AuthModuleOptions.
 *
 * @remarks
 * Ensures that required options are provided and optional ones have valid values.
 */
export const AuthModuleOptionsSchema = z.object({
  secret: z.string().min(1, "JWT secret is required"),
  lifetime: z.number().int().positive().optional(),
  issuer: z.string().optional(),
  audience: z.union([z.string(), z.array(z.string())]).optional(),
  algorithm: z
    .enum(["HS256", "HS384", "HS512", "RS256", "RS384", "RS512"])
    .optional(),
  maxRefreshWindow: z.number().int().positive().optional(),
  minRefreshWindow: z.number().int().positive().optional(),
  twoFactor: z
    .object({
      validityDuration: z.number().int().positive().optional(),
      requiredForRoles: z.array(z.string()).optional(),
    })
    .optional(),
  cookie: z
    .object({
      name: z.string().min(1).optional(),
      domain: z.string().optional(),
      path: z.string().optional(),
      httpOnly: z.boolean().optional(),
      secure: z.boolean().optional(),
      sameSite: z.enum(["strict", "lax", "none"]).optional(),
      maxAge: z.number().int().positive().optional(),
    })
    .optional(),
  header: z
    .object({
      name: z.string().min(1).optional(),
      prefix: z.string().min(1).optional(),
    })
    .optional(),
});

/**
 * Type inference helpers for validated data.
 */
export type ValidatedAuthUser = z.infer<typeof AuthUserSchema>;
export type ValidatedJWTPayload = z.infer<typeof JWTPayloadSchema>;
export type ValidatedAuthModuleOptions = z.infer<
  typeof AuthModuleOptionsSchema
>;
