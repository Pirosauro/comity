import type { AuthSession, Result } from "./types.js";

export const AUTH_SESSION_INVARIANT_REASONS = {
  /** Session ID missing */
  SESSION_ID_MISSING: "auth:session_id_missing",

  /** Created at timestamp invalid */
  CREATED_AT_INVALID: "auth:created_at_invalid",

  /** Verified at timestamp invalid */
  VERIFIED_AT_INVALID: "auth:verified_at_invalid",

  /** Expires at timestamp invalid */
  EXPIRES_AT_INVALID: "auth:expires_at_invalid",

  /** Assurance methods empty */
  ASSURANCE_METHODS_EMPTY: "auth:assurance_methods_empty",
} as const;

export type AuthSessionInvariantReason =
  (typeof AUTH_SESSION_INVARIANT_REASONS)[keyof typeof AUTH_SESSION_INVARIANT_REASONS];

export function checkSessionInvariants(
  session: AuthSession
): Result<void, AuthSessionInvariantReason> {
  // 1. Basic invariants
  if (!session.id) {
    return {
      ok: false,
      reason: AUTH_SESSION_INVARIANT_REASONS.SESSION_ID_MISSING,
    };
  }

  // 2. Timestamp validity
  if (session.createdAt <= 0) {
    return {
      ok: false,
      reason: AUTH_SESSION_INVARIANT_REASONS.CREATED_AT_INVALID,
    };
  }

  // 3. Verified at timestamp validity
  if (
    session.verifiedAt !== undefined &&
    session.verifiedAt < session.createdAt
  ) {
    return {
      ok: false,
      reason: AUTH_SESSION_INVARIANT_REASONS.VERIFIED_AT_INVALID,
    };
  }

  // 4. Expires at timestamp validity
  if (
    session.expiresAt !== undefined &&
    session.expiresAt <= session.createdAt
  ) {
    return {
      ok: false,
      reason: AUTH_SESSION_INVARIANT_REASONS.EXPIRES_AT_INVALID,
    };
  }

  // 5. Assurance methods non-empty
  if (!session.assurance.methods.length) {
    return {
      ok: false,
      reason: AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_METHODS_EMPTY,
    };
  }

  return { ok: true, value: undefined };
}
