/**
 * ACL action types supported by the helpers.
 *
 * @remarks
 * These actions are used when checking permissions at both the subject
 * and field level. They map to typical CRUD operations.
 */
export type AclAction = "read" | "create" | "update" | "delete";

/**
 * Minimal shape of an ACL-protected entity.
 *
 * @remarks
 * Entities used with the ACL helpers must expose a unique `id` property
 * which is used in error metadata and repository operations.
 */
export interface AclEntity {
  /** Unique identifier for the resource instance */
  id: string;
}

/**
 * A more permissive entity type used throughout the package.
 *
 * @remarks
 * `AclEntityLike` extends the minimal `AclEntity` shape with an index
 * signature to allow arbitrary fields (columns) to be referenced by name.
 */
export type AclEntityLike = AclEntity & Record<string, any>;

/**
 * Adapter interface that integrates an ACL implementation with the helpers.
 *
 * @typeParam E - The entity type the adapter protects (should extend `AclEntity`)
 */
export interface AclAdapter<E> {
  /** Logical resource type (Organization, Tenant, Workspace, ...) */
  readonly resourceType: string;

  /**
   * Filter a candidate list of readable fields according to the adapter rules.
   *
   * @param action - The ACL action (always `read` when filtering readable fields)
   * @param resource - Resource instance used for subject-level checks
   * @param fields - Candidate fields requested by the caller
   * @returns Subset of `fields` that are allowed for reading
   */
  filterReadableFields(
    action: AclAction,
    resource: E,
    fields: readonly string[]
  ): readonly string[];

  /**
   * Filter a candidate list of writable fields according to the adapter rules.
   *
   * @param action - The ACL action (one of `create` or `update`)
   * @param resource - Resource instance used for subject-level checks
   * @param fields - Candidate fields requested by the caller
   * @returns Subset of `fields` that are allowed for writing
   */
  filterWritableFields(
    action: "create" | "update",
    resource: E,
    fields: readonly string[]
  ): readonly string[];

  /**
   * Check whether the action is allowed for the given resource instance.
   *
   * @param action - The action to check
   * @param resource - The resource instance
   * @returns `true` when the action is permitted, otherwise `false`
   */
  can(action: AclAction, resource: E): boolean;
}

/**
 * A validator type used to coerce and validate requested field lists.
 *
 * @remarks
 * The validator receives an array of strings (requested fields) and must
 * return a typed, validated list of allowed column names (tuple/readonly).
 */
export type AclFieldListValidator<C extends readonly string[]> = (
  input: readonly string[]
) => C;
