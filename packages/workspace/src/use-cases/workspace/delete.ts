import type { AnyMongoAbility } from "@casl/ability";
import type { DeleteWorkspaceInput } from "../../validation/workspace.js";
import type { WorkspaceRepository } from "../../repositories/workspace.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

/**
 * Delete a workspace (soft delete)
 *
 * This use case validates the user's permission to delete the workspace,
 * then performs a soft delete by setting the deletedAt timestamp.
 *
 * @param data - The deletion data including workspace ID
 * @param repository - The workspace repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to delete the workspace
 * @throws {NotFoundError} If the workspace is not found
 */
export const deleteWorkspace = async (
  data: DeleteWorkspaceInput,
  repository: WorkspaceRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  const { id } = data;

  // Retrieve the workspace
  const [workspace] = (await repository.read(id)) ?? [];

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  // Check permission to delete the workspace
  if (!ability.can("delete", subject("Workspace", workspace))) {
    throw new ForbiddenError("You are not allowed to delete this workspace");
  }

  // Delete the workspace
  await repository.delete(id);
};
