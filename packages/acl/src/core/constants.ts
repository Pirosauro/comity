/**
 * ACL access denial reasons.
 *
 * Invariants:
 * - Values are non-empty strings with colon-separated prefixes
 * - Used only for deny decisions (never for allow)
 * - Case-sensitive and should not be localized
 *
 * Misuse Prevention:
 * - Do not use these values for allow decisions
 * - Custom reasons should follow the same prefix:pattern format
 */
export const ACL_ACCESS_DENY_REASONS = {
  /** Access explicitly forbidden by policy */
  FORBIDDEN: "acl:forbidden",

  /** Required role not assigned to subject */
  MISSING_ROLE: "acl:missing-role",

  /** Policy condition not satisfied */
  CONDITION_NOT_MET: "acl:condition-not-met",

  /** No applicable policy found */
  POLICY_NOT_FOUND: "acl:policy-not-found",
} as const;

export type AccessDenyReason =
  (typeof ACL_ACCESS_DENY_REASONS)[keyof typeof ACL_ACCESS_DENY_REASONS];
