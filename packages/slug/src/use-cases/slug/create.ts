import type { AnyMongoAbility } from "@casl/ability";
import type { SlugRepository } from "../../repositories/slug.js";
import type { CreateSlugInput } from "../../validation/slug.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";
import { createSlugInputSchema } from "../../validation/slug.js";

/**
 * Creates a new slug with comprehensive input and permission validation using CASL ability system.
 *
 * @param data - Slug data to create (validated against schema)
 * @param repository - Slug repository for database operations
 * @param ability - CASL ability instance for permission validation
 *
 * @returns Promise that resolves when the slug is successfully created
 *
 * @throws {@link Error} When input data fails validation
 * @throws {@link ForbiddenError} When the ability lacks 'create' permission for slugs in the specified channel
 *
 * @remarks
 * **Validation Strategy:**
 * - **Input validation**: Validates data structure, types, and business rules using Zod schema
 * - **Permission validation**: Uses CASL ability for authorization checks
 * - **Data sanitization**: Ensures clean, validated data before database operations
 *
 * **Permission Strategy:**
 * - Uses the provided CASL ability for permission validation
 * - Permission is checked against the specific channel being targeted
 * - No default abilities - explicit permission required
 *
 * @example
 * Creating a slug with validated input
 * ```typescript
 * const newSlug = await createSlug({
 *   workspaceId: 'workspace-123',
 *   source: '/old-path',
 *   target: '/new-path',
 *   meta: { type: 'redirect' }
 * }, slugRepo, ability);
 * ```
 */
export const createSlug = async (
  data: CreateSlugInput,
  repository: SlugRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  // Validate input data against schema
  data = createSlugInputSchema.parse(data);

  // Check if the ability has permission to create slugs
  if (!ability.can("create", subject("Slug", data))) {
    throw new ForbiddenError(
      `You do not have permission to create slug for workspace '${data.workspaceId}'. Required permission: create Slug.`
    );
  }

  // Create the slug in the database with validated data
  await repository.create(data);
};
