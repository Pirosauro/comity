import type { AclAdapter, AclEntityLike } from "./types.js";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

/**
 * Options for `deleteWithAcl` helper.
 *
 * @typeParam E - Entity type
 */
export interface DeleteWithAclOptions<E extends AclEntityLike> {
  /** ACL adapter */
  acl: AclAdapter<E>;
  /** Target resource */
  resource: E;
  /** Repository delete/remove function returning `true` when deleted */
  delete: (id: string) => Promise<boolean>;
}

/**
 * Delete an entity after performing a subject-level ACL check.
 *
 * @remarks
 * Throws `ForbiddenError` when ACL denies the `delete` action and
 * `NotFoundError` when the underlying repository reports the resource
 * was not found/deleted.
 *
 * @typeParam E - Entity type
 * @param options - `DeleteWithAclOptions` object
 * @throws {ForbiddenError} When ACL denies deletion
 * @throws {NotFoundError} When repository signals deletion failure
 */
export async function deleteWithAcl<E extends AclEntityLike>({
  acl,
  resource,
  delete: remove,
}: DeleteWithAclOptions<E>): Promise<void> {
  if (!acl.can("delete", resource)) {
    throw new ForbiddenError("Not allowed", {
      action: "delete",
      subject: acl.resourceType,
      id: resource.id,
    });
  }

  const ok = await remove(resource.id);

  if (!ok) {
    throw new NotFoundError("Resource not found", {
      action: "delete",
      subject: acl.resourceType,
      id: resource.id,
    });
  }
}
