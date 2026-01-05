import type { AuthSession, Result } from "./types.js";
import type { AuthAssurancePolicyConfig } from "./policy.js";

import { isSessionExpired, isVerificationFresh } from "./session.js";
import { calculateAssuranceScore } from "./assurance.js";
import { DEFAULT_AUTH_ASSURANCE_POLICY } from "./policy.js";

export const AUTH_SESSION_VALIDATION_REASONS = {
  /** Session hard-expired */
  SESSION_EXPIRED: "auth:session_expired",

  /** No strong authentication ever completed */
  NOT_VERIFIED: "auth:not_verified",

  /** Last strong authentication too old */
  VERIFICATION_TOO_OLD: "auth:verification_too_old",

  /** Assurance score below policy threshold */
  ASSURANCE_INSUFFICIENT: "auth:assurance_insufficient",
} as const;

export type AuthSessionValidationReason =
  (typeof AUTH_SESSION_VALIDATION_REASONS)[keyof typeof AUTH_SESSION_VALIDATION_REASONS];

export interface ValidateSessionOptions {
  /** Current timestamp (seconds since epoch) */
  now: number;

  /** Assurance policy to use (defaults to library policy) */
  policy?: AuthAssurancePolicyConfig;

  /** Minimum assurance score required */
  minAssuranceScore?: number;

  /** Max age (seconds) since last strong authentication */
  maxVerificationAge?: number;
}

export function validateSession(
  session: AuthSession,
  options: ValidateSessionOptions
): Result<void, AuthSessionValidationReason> {
  const {
    now,
    policy = DEFAULT_AUTH_ASSURANCE_POLICY,
    minAssuranceScore,
    maxVerificationAge,
  } = options;

  // 1. Hard expiration
  if (isSessionExpired(session, now)) {
    return {
      ok: false,
      reason: AUTH_SESSION_VALIDATION_REASONS.SESSION_EXPIRED,
    };
  }

  // 2. Strong authentication presence
  if (!session.verifiedAt) {
    return {
      ok: false,
      reason: AUTH_SESSION_VALIDATION_REASONS.NOT_VERIFIED,
    };
  }

  // 3. Verification freshness
  if (
    maxVerificationAge !== undefined &&
    !isVerificationFresh(session, now, maxVerificationAge)
  ) {
    return {
      ok: false,
      reason: AUTH_SESSION_VALIDATION_REASONS.VERIFICATION_TOO_OLD,
    };
  }

  // 4. Assurance score validation (policy-based)
  if (minAssuranceScore !== undefined) {
    const score = calculateAssuranceScore(session, policy, {
      now,
    });

    if (score < minAssuranceScore) {
      return {
        ok: false,
        reason: AUTH_SESSION_VALIDATION_REASONS.ASSURANCE_INSUFFICIENT,
      };
    }
  }

  return { ok: true, value: undefined };
}
