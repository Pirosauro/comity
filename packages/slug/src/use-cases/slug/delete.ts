import type { AnyMongoAbility } from "@casl/ability";
import type { SlugRepository } from "../../repositories/slug.js";
import type { SlugId } from "../../validation/slug.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import { deleteSlugInputSchema } from "../../validation/slug.js";

/**
 * Deletes a slug with permission validation using CASL ability system.
 *
 * @param id - Slug identifier to delete
 * @param repository - Slug repository for database operations
 * @param ability - CASL ability instance for permission validation
 *
 * @returns Promise that resolves when the slug is successfully deleted
 *
 * @throws {@link NotFoundError} When slug with the specified ID is not found
 * @throws {@link ForbiddenError} When the ability lacks 'delete' permission for the slug
 *
 * @remarks
 * **Permission Strategy:**
 * - Uses the provided CASL ability for permission validation
 * - Fetches existing slug first to validate permissions and current state
 * - No default abilities - explicit permission required
 *
 * @example
 * Deleting a slug with ability
 * ```typescript
 * await deleteSlug('slug-123', slugRepo, ability);
 * ```
 */
export const deleteSlug = async (
  id: SlugId,
  repository: SlugRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  // Validate input
  deleteSlugInputSchema.parse({ id });

  // First, fetch the existing slug to validate permissions
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

  // Check if the ability has permission to delete this slug
  if (!ability.can("delete", subject("Slug", slug))) {
    throw new ForbiddenError(
      `You do not have permission to delete slug '${id}' in workspace '${slug.workspaceId}'. Required permission: delete Slug. Slug status: ${slug.status}`
    );
  }

  // Perform the deletion
  await repository.delete(id);
};
