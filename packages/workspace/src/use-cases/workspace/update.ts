import type { AnyMongoAbility } from "@casl/ability";
import type { UpdateWorkspaceInput } from "../../validation/workspace.js";
import type { WorkspaceRepository } from "../../repositories/workspace.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

/**
 * Update a workspace
 *
 * This use case validates the user's permission to update the workspace,
 * then applies the updates to the database.
 *
 * @param data - The update data including workspace ID and fields to update
 * @param repository - The workspace repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to update the workspace
 * @throws {NotFoundError} If the workspace is not found
 * @returns The updated workspace record
 */
export const updateWorkspace = async (
  data: UpdateWorkspaceInput,
  repository: WorkspaceRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  const { id, ...args } = data;

  // Retrieve the workspace
  const [workspace] = (await repository.read(id)) ?? [];

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  // Check permission to update the workspace
  if (!ability.can("update", subject("Workspace", workspace))) {
    throw new ForbiddenError("You are not allowed to update this workspace");
  }

  // Update the workspace
  await repository.update(id, args);
};
