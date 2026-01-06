/**
 * Core ACL vocabulary types.
 *
 * Invariants:
 * - All types are immutable after construction
 * - String fields are non-empty when required
 * - Array fields are non-empty when present
 */

/**
 * Subject making an access request.
 *
 * Invariants:
 * - id is non-empty string and unique across the system
 * - roles array is readonly and contains only non-empty strings
 * - attributes is readonly and immutable
 */
export type Subject = {
  /** Unique subject identifier (invariant: non-empty, case-sensitive) */
  id: string;

  /** Assigned roles (invariant: readonly, non-empty strings if present) */
  roles?: readonly string[];

  /** Subject attributes (invariant: readonly, immutable) */
  attributes?: Readonly<Record<string, unknown>>;
};

/**
 * Resource being accessed.
 *
 * Invariants:
 * - type is non-empty string used for policy matching
 * - id is optional but non-empty string if present
 * - attributes is readonly and immutable
 */
export type Resource = {
  /** Resource type identifier (invariant: non-empty, case-sensitive) */
  type: string;

  /** Resource instance identifier (invariant: non-empty if present) */
  id?: string;

  /** Resource attributes (invariant: readonly, immutable) */
  attributes?: Readonly<Record<string, unknown>>;
};

/**
 * Additional context for access evaluation.
 *
 * Invariants:
 * - Readonly and immutable after creation
 * - May be empty but never null/undefined
 */
export type AccessContext = Readonly<Record<string, unknown>>;

/**
 * Action being requested.
 *
 * Invariants:
 * - Non-empty string
 * - Case-sensitive for policy matching
 */
export type Action = string;
