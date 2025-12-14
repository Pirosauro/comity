import type { AnyMongoAbility } from "@casl/ability";
import type { CreateWorkspaceInput } from "../../validation/workspace.js";
import type { WorkspaceRepository } from "../../repositories/workspace.js";
import { subject } from "@casl/ability";
import { ForbiddenError } from "@comity/core/errors";

/**
 * Create a new workspace
 *
 * This use case validates the user's permission to create a workspace,
 * then persists the workspace to the database.
 *
 * @param data - The workspace data to create
 * @param repository - The workspace repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to create workspaces
 * @throws {Error} If the workspace creation fails
 * @returns The created workspace ID
 */
export const createWorkspace = async (
  data: CreateWorkspaceInput,
  repository: WorkspaceRepository,
  ability: AnyMongoAbility
): Promise<void> => {
  // Check permission to create workspace
  if (!ability.can("create", subject("Workspace", data))) {
    throw new ForbiddenError("You are not allowed to create workspaces");
  }

  // Create the workspace
  await repository.create(data);
};
