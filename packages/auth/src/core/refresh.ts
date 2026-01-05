import type { AuthMethod, AuthSession, Result } from "./types.js";

export const AUTH_REFRESH_REASONS = {
  /** Assurance score too low to allow refresh */
  ASSURANCE_INSUFFICIENT: "auth:assurance_insufficient",

  /** Last strong verification too old */
  VERIFICATION_TOO_OLD: "auth:verification_too_old",

  /** Required authentication method missing */
  METHOD_MISSING: "auth:method_missing",
} as const;

export type AuthRefreshReason =
  (typeof AUTH_REFRESH_REASONS)[keyof typeof AUTH_REFRESH_REASONS];

export interface RefreshRequirement {
  /** Minimum assurance score required */
  minScore?: number;

  /** Max age (seconds) since last strong verification */
  maxVerificationAge?: number;

  /** Required authentication methods (at least one must be present) */
  requiredMethods?: AuthMethod[];
}

export interface RefreshAllowed {
  /** Result of the refresh evaluation */
  allowed: true;
}

export interface RefreshDenied {
  /** Result of the refresh evaluation */
  allowed: false;

  /** Reason for refresh denial */
  reason: AuthRefreshReason;

  /** Missing required authentication methods */
  missingMethods?: AuthMethod[];

  /** Current assurance score */
  currentScore?: number;

  /** Required assurance score */
  requiredScore?: number;
}

/**
 * Evaluate if a session refresh is allowed based on the given requirement.
 *
 * IMPORTANT:
 * - This function does NOT perform the refresh itself.
 *   It only evaluates if it's allowed.
 * - Providing a maxVerificationAge implies a strong verification requirement.
 */
export function evaluateRefresh(
  session: AuthSession,
  requirement: RefreshRequirement,
  now: number
): Result<RefreshAllowed | RefreshDenied, never> {
  // 1. Verification freshness
  if (
    requirement.maxVerificationAge !== undefined &&
    now - (session.verifiedAt ?? 0) > requirement.maxVerificationAge
  ) {
    return {
      ok: true,
      value: {
        allowed: false,
        reason: AUTH_REFRESH_REASONS.VERIFICATION_TOO_OLD,
      },
    };
  }

  // 2. Assurance score check (snapshot-based)
  if (
    requirement.minScore !== undefined &&
    session.assurance.score !== undefined &&
    session.assurance.score < requirement.minScore
  ) {
    return {
      ok: true,
      value: {
        allowed: false,
        reason: AUTH_REFRESH_REASONS.ASSURANCE_INSUFFICIENT,
        currentScore: session.assurance.score,
        requiredScore: requirement.minScore,
      },
    };
  }

  // 3. Required methods
  if (requirement.requiredMethods?.length) {
    const present = new Set(session.assurance.methods);
    const missing = requirement.requiredMethods.filter((m) => !present.has(m));

    if (missing.length > 0) {
      return {
        ok: true,
        value: {
          allowed: false,
          reason: AUTH_REFRESH_REASONS.METHOD_MISSING,
          missingMethods: missing,
        },
      };
    }
  }

  // 4. Refresh allowed
  return {
    ok: true,
    value: {
      allowed: true,
    },
  };
}
