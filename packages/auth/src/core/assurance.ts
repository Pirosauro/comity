import type { AuthSession } from "./types.js";
import type { AuthAssurancePolicyConfig } from "./policy.js";

/**
 * Assurance calculation utilities.
 *
 * Invariants:
 * - calculateAssuranceScore always returns a non-negative integer
 * - Score calculation is deterministic for same inputs
 * - Policy configuration is immutable during calculation
 */

export interface CalculateAssuranceContext {
  /** Timestamp (invariant: seconds since epoch) */
  now: number;
}

/**
 * Calculate an assurance score from methods and context using a policy.
 *
 * Invariants:
 * - Returns a non-negative integer score
 * - Score is derived solely from policy weights and session data
 * - Same inputs always produce same score (deterministic)
 *
 * Misuse Prevention:
 * - Do not use score directly for security decisions (use policy tiers)
 * - Understand that scoring is implementation detail, not contract
 */
export function calculateAssuranceScore(
  session: AuthSession,
  policy: AuthAssurancePolicyConfig,
  context: CalculateAssuranceContext
): number {
  let score = 0;

  // Method-based scoring (invariant: each method adds its configured weight)
  for (const method of session.assurance.methods) {
    score += policy.methodWeights[method] ?? 0;
  }

  // Device trust bonus (invariant: bonus applied only if deviceId present)
  if (session.assurance.context.deviceId) {
    score += policy.deviceTrustedBonus;
  }

  // Temporal degradation (invariant: score reduced if verification too old)
  if (session.verifiedAt !== undefined && policy.maxAgeSeconds !== undefined) {
    const age = context.now - session.verifiedAt;

    if (age > policy.maxAgeSeconds) {
      score = Math.floor(score * policy.agePenaltyFactor);
    }
  }

  throw new Error("Not implemented"); // Placeholder for further scoring rules

  return score;
}
