import type {
  AclAdapter,
  AclEntityLike,
  AclFieldListValidator,
} from "./types.js";
import { ForbiddenError } from "@comity/core/errors";

/**
 * Options for `updateWithAcl` helper.
 *
 * @typeParam E - Entity type
 * @typeParam P - Patch shape
 * @typeParam C - Validated column tuple type
 */
export interface UpdateWithAclOptions<
  E extends AclEntityLike,
  P extends Partial<E>,
  C extends readonly string[]
> {
  /** ACL adapter */
  acl: AclAdapter<E>;
  /** Target resource for subject-level checks */
  resource: E;
  /** Partial object containing updates */
  patch: P;
  /** Validator for requested field keys */
  fieldsValidator: AclFieldListValidator<C>;
  /** Repository update function */
  update: (data: Partial<E>) => Promise<void>;
}

/**
 * Update an entity after applying subject- and field-level ACL checks.
 *
 * @remarks
 * Execution steps:
 * 1. Subject-level `acl.can('update', resource)` check.
 * 2. Validate patch keys with `fieldsValidator`.
 * 3. Filter patch keys by `acl.filterWritableFields`.
 * 4. Throw `ForbiddenError` when no writable fields remain.
 * 5. Call the provided `update` function with the filtered payload.
 *
 * @typeParam E - Entity type
 * @typeParam P - Patch shape
 * @typeParam C - Validated column tuple type
 * @param options - `UpdateWithAclOptions` object
 * @throws {ForbiddenError} When subject-level or field-level checks fail
 */
export async function updateWithAcl<
  E extends AclEntityLike,
  P extends Partial<E>,
  C extends readonly string[]
>({
  acl,
  resource,
  patch,
  fieldsValidator,
  update,
}: UpdateWithAclOptions<E, P, C>): Promise<void> {
  // 1. Subject-level ACL
  if (!acl.can("update", resource)) {
    throw new ForbiddenError("Not allowed", {
      action: "update",
      subject: acl.resourceType,
      id: resource.id,
    });
  }

  // 2. Validate input keys
  const requestedFields = fieldsValidator(Object.keys(patch));

  // 3. Field-level ACL
  const allowedFields = acl.filterWritableFields(
    "update",
    resource,
    requestedFields
  );

  if (allowedFields.length === 0) {
    throw new ForbiddenError("No writable fields", {
      action: "update",
      subject: acl.resourceType,
      id: resource.id,
      fields: allowedFields,
    });
  }

  // 4. Build payload
  const payload = Object.fromEntries(
    Object.entries(patch).filter(([k]) =>
      allowedFields.includes(k as C[number])
    )
  ) as Partial<E>;

  await update(payload);
}
