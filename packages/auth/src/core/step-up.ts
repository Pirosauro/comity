import type { AuthMethod, AuthSession, Result } from "./types.js";

export const AUTH_STEP_UP_REASONS = {
  /** Assurance score too low */
  ASSURANCE_INSUFFICIENT: "auth:assurance_insufficient",

  /** Required authentication method missing */
  METHOD_MISSING: "auth:method_missing",

  /** Last verification too old */
  VERIFICATION_TOO_OLD: "auth:verification_too_old",
} as const;

export type AuthStepUpReason =
  (typeof AUTH_STEP_UP_REASONS)[keyof typeof AUTH_STEP_UP_REASONS];

export interface AuthStepUpRequirement {
  /** Minimum assurance score required */
  minScore?: number;

  /** Required authentication methods (at least one must be present) */
  requiredMethods?: AuthMethod[];

  /** Max age (seconds) since last strong auth */
  maxVerificationAge?: number;
}

export interface AuthStepUpNotRequired {
  required: false;
}

export interface AuthStepUpRequired {
  required: true;

  /** Why step-up is required */
  reason: AuthStepUpReason;

  /** Missing methods, if any */
  missingMethods?: AuthMethod[];

  /** Current assurance score (if known) */
  currentScore?: number;

  /** Required assurance score */
  requiredScore?: number;
}

/**
 * Evaluate if a step-up is required based on the given requirement.
 *
 * IMPORTANT:
 * - This function does NOT perform the step-up itself.
 *   It only evaluates if it's needed.
 * - Providing a maxVerificationAge implies a strong verification requirement.
 */
export function evaluateStepUp(
  session: AuthSession,
  requirement: AuthStepUpRequirement,
  now: number
): Result<AuthStepUpNotRequired | AuthStepUpRequired, never> {
  // 1. Verification freshness
  if (
    requirement.maxVerificationAge !== undefined &&
    now - (session.verifiedAt ?? 0) > requirement.maxVerificationAge
  ) {
    return {
      ok: true,
      value: {
        required: true,
        reason: AUTH_STEP_UP_REASONS.VERIFICATION_TOO_OLD,
      },
    };
  }

  // 2. Required methods
  if (requirement.requiredMethods?.length) {
    const present = new Set(session.assurance.methods);
    const missing = requirement.requiredMethods.filter((m) => !present.has(m));

    if (missing.length > 0) {
      return {
        ok: true,
        value: {
          required: true,
          reason: AUTH_STEP_UP_REASONS.METHOD_MISSING,
          missingMethods: missing,
        },
      };
    }
  }

  // 3. Assurance score check (if snapshot exists)
  if (
    requirement.minScore !== undefined &&
    session.assurance.score !== undefined &&
    session.assurance.score < requirement.minScore
  ) {
    return {
      ok: true,
      value: {
        required: true,
        reason: AUTH_STEP_UP_REASONS.ASSURANCE_INSUFFICIENT,
        currentScore: session.assurance.score,
        requiredScore: requirement.minScore,
      },
    };
  }

  // 4. No step-up needed
  return {
    ok: true,
    value: {
      required: false,
    },
  };
}
