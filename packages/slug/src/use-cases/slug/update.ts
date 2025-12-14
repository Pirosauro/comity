import type { AnyMongoAbility } from "@casl/ability";
import type { SlugRepository } from "../../repositories/slug.js";
import type { UpdateSlugInput } from "../../validation/slug.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { updateSlugInputSchema } from "../../validation/slug.js";

/**
 * Updates an existing slug with permission validation using CASL ability system.
 *
 * @param data - Slug data with updates including the ID of the slug to update
 * @param repository - Slug repository for database operations
 * @param ability - CASL ability instance for permission validation
 *
 * @returns Promise that resolves when the slug is successfully updated
 *
 * @throws {@link NotFoundError} When slug with the specified ID is not found
 * @throws {@link ForbiddenError} When the ability lacks 'update' permission for the slug
 *
 * @remarks
 * **Permission Strategy:**
 * - Uses the provided CASL ability for permission validation
 * - Fetches existing slug first to validate permissions and current state
 * - Validates both current state and proposed changes against permissions
 * - No default abilities - explicit permission required
 *
 * **Update Behavior:**
 * - Fetches existing slug first to validate current state and permissions
 * - Only provided fields will be updated (partial update)
 * - ID field is automatically set and cannot be changed
 * - Validates both current state and proposed changes against permissions
 *
 * @example
 * Basic slug update with ability
 * ```typescript
 * const updatedSlug = await updateSlug(slugRepo, 'slug-123', {
 *   target: '/new-path',
 *   meta: { reason: 'Temporary redirect' }
 * }, ability);
 * ```
 */
export const updateSlug = async (
  data: UpdateSlugInput,
  repository: SlugRepository,
  ability: AnyMongoAbility,
  options: {
    softFail?: boolean;
  } = {}
): Promise<void> => {
  // Validate input data
  const { id, ...args } = updateSlugInputSchema.parse(data);

  const [slug] =
    (await repository.read(id, [
      "id",
      "workspaceId",
      "source",
      "target",
      "meta",
      "redirect",
      "createdAt",
      "updatedAt",
    ])) ?? [];

  // Check if the slug was found
  if (!slug) {
    throw new NotFoundError(`Slug with id '${id}' not found.`);
  }

  // Check if the actor has permission to update this slug
  if (!ability.can("update", subject("Slug", slug))) {
    throw new ForbiddenError(
      `You do not have permission to update slug '${id}' in workspace '${slug.workspaceId}'. Required permission: update Slug.`
    );
  }

  // Check field-level permissions for each field being updated
  const blacklist = Object.keys(args).filter(
    (field) => !ability.can("update", subject("Slug", slug), field)
  );

  if (!options.softFail && blacklist.length > 0) {
    throw new ForbiddenError(
      `You do not have permission to update fields: ${blacklist.join(
        ", "
      )} on slug '${id}'. Check your role's field-level permissions.`
    );
  }

  // Perform the update with validated data
  await repository.update(
    id,
    Object.fromEntries(
      Object.entries(args).filter(([field]) => !blacklist.includes(field))
    )
  );
};
