import type {
  AclAdapter,
  AclEntityLike,
  AclFieldListValidator,
} from "./types.js";
import { ForbiddenError, NotFoundError } from "@comity/core/errors";

/**
 * Options for `readWithAcl` helper.
 *
 * @typeParam E - Entity type
 * @typeParam C - Tuple of allowed column names
 */
export interface ReadWithAclOptions<
  E extends AclEntityLike,
  C extends readonly string[]
> {
  /** ACL adapter */
  acl: AclAdapter<E>;
  /** Resource used for subject-level checks (id is required) */
  resource: E;
  /** Fields requested by the caller (unvalidated) */
  requestedFields?: readonly string[];
  /** Mandatory fields to always include in the DB query */
  requiredFields?: readonly string[];
  /** Validator function for requested fields */
  fieldsValidator: AclFieldListValidator<C>;
  /** Repository read function that returns the entity or `null` */
  read: (fields: readonly string[]) => Promise<E | null>;
}

/**
 * Read an entity while enforcing field- and subject-level ACL rules.
 *
 * @remarks
 * The function performs these steps:
 * 1. Validate requested fields using `fieldsValidator` and apply field-level ACL
 *    via `acl.filterReadableFields`.
 * 2. Merge mandatory `requiredFields` with the allowed set and query the repo.
 * 3. Throw `NotFoundError` when the entity does not exist.
 * 4. Perform a subject-level `acl.can('read', entity)` check and throw
 *    `ForbiddenError` when denied.
 * 5. Return a projection of the entity containing only the allowed fields.
 *
 * @typeParam E - Entity type
 * @typeParam C - Validated column tuple type
 * @param options - `ReadWithAclOptions` object
 * @returns Partial entity containing only readable fields
 * @throws {NotFoundError} When the entity is missing
 * @throws {ForbiddenError} When subject-level ACL denies access
 */
export async function readWithAcl<
  E extends AclEntityLike,
  C extends readonly string[]
>({
  acl,
  resource,
  requestedFields,
  requiredFields = [],
  fieldsValidator,
  read,
}: ReadWithAclOptions<E, C>): Promise<Partial<E>> {
  // 1. Validate & field-level ACL
  const allowedFields = acl.filterReadableFields(
    "read",
    resource,
    fieldsValidator(requestedFields ?? [])
  );
  // 2. Merge ACL-mandatory fields
  const columns = Array.from(new Set([...allowedFields, ...requiredFields]));

  // 3. Query
  const entity = await read(columns);

  if (!entity) {
    throw new NotFoundError("Resource not found", {
      action: "read",
      subject: acl.resourceType,
      id: resource.id,
      fields: allowedFields,
    });
  }

  // 4. Subject-level ACL
  if (!acl.can("read", entity)) {
    throw new ForbiddenError("Not allowed", {
      action: "read",
      subject: acl.resourceType,
      id: resource.id,
      fields: allowedFields,
    });
  }

  // 5. Return only allowed fields
  return Object.fromEntries(
    allowedFields.map((c) => [c, entity[c]])
  ) as Partial<E>;
}
