import type {
  AclAdapter,
  AclEntityLike,
  AclFieldListValidator,
} from "./types.js";

/**
 * Options for `listWithAcl` helper.
 *
 * @typeParam E - Entity type
 * @typeParam C - Allowed field names tuple
 */
export interface ListWithAclOptions<
  E extends AclEntityLike,
  C extends readonly string[]
> {
  /** ACL adapter */
  acl: AclAdapter<E>;
  /** Requested fields (already validated by use case) */
  requestedFields?: readonly string[];
  /** Mandatory fields (id, foreign keys, etc.) */
  requiredFields?: readonly string[];
  /** Fields whitelist validator */
  fieldsValidator: AclFieldListValidator<C>;
  /** Repository list function which accepts selected fields */
  list: (fields: readonly string[]) => Promise<E[]>;
}

/**
 * List entities with ACL-applied record filtering and field projection.
 *
 * @remarks
 * Steps performed:
 * 1. Determine allowed fields using `acl.filterReadableFields` and the
 *    provided `fieldsValidator`.
 * 2. Merge mandatory `requiredFields` into the selected columns.
 * 3. Query the repository using the final columns projection.
 * 4. Filter out records where `acl.can('read', entity)` is false.
 * 5. Project each remaining record to the allowed fields.
 *
 * @typeParam E - Entity type
 * @typeParam C - Allowed field names tuple
 * @param options - `ListWithAclOptions` object
 * @returns Array of projected entities (possibly empty)
 */
export async function listWithAcl<
  E extends AclEntityLike,
  C extends readonly string[]
>({
  acl,
  fieldsValidator,
  requestedFields,
  requiredFields = [],
  list,
}: ListWithAclOptions<E, C>): Promise<Partial<E>[]> {
  // 1. Field-level ACL (soft)
  const allowedFields = acl.filterReadableFields(
    "read",
    {} as E,
    fieldsValidator(requestedFields ?? [])
  );

  // 2. Merge mandatory fields
  const columns = Array.from(new Set([...allowedFields, ...requiredFields]));

  // 3. Query
  const entities = await list(columns);

  if (!entities.length) {
    return [];
  }

  // 4. Record-level ACL (soft filter)
  const readableEntities = entities.filter((entity) => acl.can("read", entity));

  // 5. Project allowed fields
  return readableEntities.map((entity) =>
    Object.fromEntries(allowedFields.map((c) => [c, entity[c]]))
  ) as Partial<E>[];
}
