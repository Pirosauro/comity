/**
 * Access request representation.
 *
 * @template S - Subject attribute type
 * @template R - Resource attribute type
 * @template C - Context attribute type
 */
export type AccessRequest<
  S extends Record<string, unknown> = Record<string, unknown>,
  R extends Record<string, unknown> = Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> = {
  /** Subject making the access request */
  subject: {
    /** Unique identifier of the subject (invariant: non-empty string) */
    id: string;

    /** Roles assigned to the subject (invariant: non-empty strings if present) */
    roles?: string[];

    /** Subject attributes (invariant: immutable after creation) */
    attributes?: S;
  };

  /** Action being requested (invariant: non-empty string, case-sensitive) */
  action: string;

  /** Target resource of the access request */
  resource: {
    /** Resource type identifier (invariant: non-empty string, used for policy matching) */
    type: string;

    /** Resource instance identifier (invariant: non-empty if present) */
    id?: string;

    /** Resource attributes (invariant: immutable after creation) */
    attributes?: R;
  };

  /** Additional context (invariant: immutable if present) */
  context?: C;
};

/**
 * Access denial decision.
 *
 * Invariants:
 * - allowed is always false
 * - reason is non-empty string from defined constants
 */
export interface Deny {
  /** Always false for deny decisions */
  readonly allowed: false;

  /** Reason for denial (invariant: from ACL_ACCESS_DENY_REASONS) */
  readonly reason: string;

  /** Policy that denied access (optional, for audit) */
  readonly policy?: string;

  /** Additional metadata (invariant: immutable) */
  readonly meta?: Record<string, unknown>;
}

/**
 * Access allowance decision.
 *
 * Invariants:
 * - allowed is always true
 * - policy is non-empty string identifying granting policy
 */
export interface Allow {
  /** Always true for allow decisions */
  readonly allowed: true;

  /** Policy that granted access (invariant: non-empty, for audit) */
  readonly policy: string;

  /** Additional metadata (invariant: immutable) */
  readonly meta?: Record<string, unknown>;
}

/**
 * Union type for access control decisions.
 *
 * Invariants:
 * - Exactly one of Allow or Deny
 * - Decision is final and immutable
 */
export type AccessDecision = Allow | Deny;
