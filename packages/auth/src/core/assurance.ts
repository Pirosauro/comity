import type { AuthSession } from "./types.js";
import type { AuthAssurancePolicyConfig } from "./policy.js";

export interface CalculateAssuranceContext {
  /** Timestamp */
  now: number;
}

/**
 * Calculate an assurance score from methods and context using a policy.
 *
 * IMPORTANT:
 * - scoring is an implementation detail
 * - callers must rely ONLY on the returned tier
 */
export function calculateAssuranceScore(
  session: AuthSession,
  policy: AuthAssurancePolicyConfig,
  context: CalculateAssuranceContext
): number {
  let score = 0;

  // 1. Method-based scoring
  for (const method of session.assurance.methods) {
    score += policy.methodWeights[method] ?? 0;
  }

  // 2. Device trust bonus
  if (session.assurance.context.deviceId) {
    score += policy.deviceTrustedBonus;
  }

  // 3. Temporal degradation (strong auth freshness)
  if (session.verifiedAt !== undefined && policy.maxAgeSeconds !== undefined) {
    const age = context.now - session.verifiedAt;

    if (age > policy.maxAgeSeconds) {
      score = Math.floor(score * policy.agePenaltyFactor);
    }
  }

  return score;
}
