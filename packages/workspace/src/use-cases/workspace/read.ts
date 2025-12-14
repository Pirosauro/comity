import type { AnyMongoAbility } from "@casl/ability";
import type {
  OrganizationId,
  WorkspaceCode,
  WorkspaceColumns,
  WorkspaceId,
} from "../../validation/index.js";
import type {
  WorkspaceRepository,
  WorkspaceResultColumns,
} from "../../repositories/workspace.js";
import { subject } from "@casl/ability";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";
import {
  workspaceCodeSchema,
  workspaceColumnsSchema,
} from "../../validation/index.js";

/**
 * Read a workspace by ID
 *
 * This use case validates the user's permission to read the workspace,
 * then retrieves the workspace from the database.
 *
 * @param id - The workspace ID to read
 * @param repository - The workspace repository instance
 * @param ability - The user's CASL ability for permission checking
 * @throws {ForbiddenError} If the user lacks permission to read the workspace
 * @throws {NotFoundError} If the workspace is not found
 * @returns The workspace record
 */
export const readWorkspace = async <T = Partial<WorkspaceResultColumns>>(
  id: WorkspaceId,
  repository: WorkspaceRepository,
  ability: AnyMongoAbility
): Promise<T> => {
  // Retrieve the workspace
  const [workspace] = (await repository.read(id)) ?? [];

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  // Check permission to read the workspace
  if (!ability.can("read", subject("Workspace", workspace))) {
    throw new ForbiddenError("You are not allowed to read this workspace");
  }

  return workspace as T;
};

export async function readWorkspaceByCode<T = Partial<WorkspaceColumns>>(
  code: WorkspaceCode,
  organizationId: OrganizationId,
  repository: WorkspaceRepository,
  ability: AnyMongoAbility,
  options: { columns?: WorkspaceColumns } = {}
): Promise<T> {
  if (!organizationId) {
    throw new Error("Organization ID is required to read workspace by code.");
  }

  if (!ability.can("read", subject("Organization", { id: organizationId }))) {
    throw new ForbiddenError(
      `You do not have permission to read Organization with id '${organizationId}'. Required permission: read Organization.`
    );
  }

  // Validate organization code
  code = workspaceCodeSchema.parse(code);

  // Validate and pre-filter requested columns based on field-level permissions
  options.columns = workspaceColumnsSchema
    .parse(options.columns)
    .filter((c) => ability.can("read", "Workspace", c));

  const [workspace] =
    (await repository.readByCode(code, organizationId, options.columns)) ?? [];

  // Check if the workspace was found
  if (!workspace) {
    throw new NotFoundError(`Workspace with code '${code}' not found.`);
  }

  // Check if the actor has permission to read this workspace
  if (!ability.can("read", subject("Workspace", workspace))) {
    throw new ForbiddenError(
      `You do not have permission to read workspace '${workspace.id}'. Required permission: read Workspace.`
    );
  }

  return workspace as T;
}
