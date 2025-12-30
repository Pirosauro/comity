import type { AclAdapter } from "./types.js";
import { ForbiddenError } from "@comity/core/errors";

/**
 * Options for `createWithAcl` helper.
 *
 * @typeParam E - Entity type
 */
export interface CreateWithAclOptions<E> {
  /** ACL adapter instance used to evaluate permissions */
  acl: AclAdapter<E>;
  /** Entity to be created */
  data: E;
  /** Underlying repository create function */
  create: (data: E) => Promise<E>;
}

/**
 * Create an entity after performing a subject-level ACL check.
 *
 * @remarks
 * This function performs a single `acl.can('create', data)` check and
 * delegates to the provided `create` function when allowed. On forbidden
 * access it throws a `ForbiddenError` enriched with action/subject metadata.
 *
 * @typeParam E - Entity type
 * @param options - `CreateWithAclOptions` object
 * @returns The created entity
 * @throws {ForbiddenError} When the ACL denies the create action
 */
export async function createWithAcl<E>({
  acl,
  data,
  create,
}: CreateWithAclOptions<E>): Promise<E> {
  if (!acl.can("create", data)) {
    throw new ForbiddenError("Not allowed", {
      action: "create",
      subject: acl.resourceType,
    });
  }

  return create(data);
}
