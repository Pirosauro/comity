import { z } from "zod";

/**
 * Zod schema for validating module metadata structure and content.
 *
 * @remarks
 * This schema ensures that all modules conform to the expected structure before
 * they are processed by the bootstrap system. It validates both the shape of
 * the metadata and the content of individual fields.
 *
 * **Validation Rules:**
 * - **name**: Non-empty string identifier for the module
 * - **version**: Semantic versioning format (e.g., "1.0.0", "2.1.3")
 * - **dependsOn**: Optional array of dependency module names
 * - **incompatibleWith**: Optional array of incompatible module names
 * - **configSchema**: Optional Zod schema for module configuration validation
 * - **setup**: Required function that returns the module setup function
 *
 * **Usage in Bootstrap:**
 * Every module is validated against this schema before its setup function
 * is called, ensuring type safety and preventing runtime errors from
 * malformed module definitions.
 *
 * @example
 * Valid module metadata
 * ```typescript
 * const validModule = {
 *   name: 'user-management',
 *   version: '1.2.0',
 *   dependsOn: ['database', 'auth'],
 *   incompatibleWith: ['legacy-users'],
 *   configSchema: z.object({
 *     tableName: z.string().default('users'),
 *     enableSoftDelete: z.boolean().default(true)
 *   }),
 *   setup: (options) => async (ctx) => {
 *     // Module setup logic
 *   }
 * };
 *
 * const result = moduleMetaSchema.parse(validModule); // ✅ Passes
 * ```
 *
 * @example
 * Schema validation errors
 * ```typescript
 * const invalidModule = {
 *   name: '', // ❌ Empty string not allowed
 *   version: '1.0', // ❌ Invalid semantic version
 *   dependsOn: [''], // ❌ Empty dependency name
 *   setup: 'not-a-function' // ❌ Must be a function
 * };
 *
 * try {
 *   moduleMetaSchema.parse(invalidModule);
 * } catch (error) {
 *   console.error('Validation failed:', error.issues);
 * }
 * ```
 */
export const moduleMetaSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Module name must be a non-empty string." }),
  version: z.string().regex(/^(\d+\.){2}\d+$/, {
    message:
      "Invalid version format. Expected semantic versioning (e.g. 1.0.0)",
  }),
  dependsOn: z
    .array(
      z
        .string()
        .min(1, { message: "Dependency names must be non-empty strings." })
    )
    .optional(),
  incompatibleWith: z
    .array(
      z.string().min(1, {
        message: "Incompatible module names must be non-empty strings.",
      })
    )
    .optional(),
  configSchema: z
    .custom<z.ZodTypeAny | undefined>(
      (val) => val === undefined || val instanceof z.ZodType,
      {
        message: "Config schema must be a valid Zod type.",
      }
    )
    .optional(),
  setup: z.custom<() => Promise<(ctx: any) => Promise<void>>>(
    (val) => typeof val === "function",
    { message: "Module must provide a setup function." }
  ),
});

/**
 * TypeScript type representing a validated module metadata object.
 *
 * @remarks
 * This type is inferred from the `moduleMetaSchema` and represents the shape
 * of a module after it has been successfully validated. Use this type for
 * type annotations when working with validated module metadata.
 *
 * **Type Safety Benefits:**
 * - Compile-time checking of module metadata structure
 * - IDE autocompletion for module properties
 * - Guaranteed presence of required fields after validation
 * - Optional fields are properly typed as potentially undefined
 *
 * @example
 * Using the validated type
 * ```typescript
 * function processModule(module: ValidatedModuleMeta) {
 *   console.log(`Processing module: ${module.name} v${module.version}`);
 *
 *   if (module.dependsOn) {
 *     console.log(`Dependencies: ${module.dependsOn.join(', ')}`);
 *   }
 *
 *   if (module.configSchema) {
 *     // TypeScript knows this is a Zod schema
 *     const defaultConfig = module.configSchema.parse({});
 *   }
 * }
 * ```
 *
 * @example
 * Function parameter typing
 * ```typescript
 * function validateAndProcess(rawModule: unknown): ValidatedModuleMeta {
 *   // Validate the module first
 *   const validated = moduleMetaSchema.parse(rawModule);
 *
 *   // Now TypeScript knows the exact shape
 *   console.log(`Module "${validated.name}" is valid`);
 *
 *   return validated;
 * }
 * ```
 */
export type ValidatedModuleMeta = z.infer<typeof moduleMetaSchema>;
