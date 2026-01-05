/**
 * Reasonable default policy.
 *
 * DEFAULT_ASSURANCE_POLICY is a reference policy, not a security guarantee.
 * Applications are expected to:
 * - override it
 * - version it
 * - or replace it entirely
 */
export const DEFAULT_AUTH_ASSURANCE_POLICY = {
  // Weights
  methodWeights: {
    // Knowledge
    password: 15,
    // Possession
    otp: 25,
    push_auth: 25,
    // Inherence
    biometric: 30,
    // Hardware / Passkeys
    passkey: 40,
    hardware_token: 40,
    // Identity proofs
    oauth2: 20,
    oidc: 20,
    saml2: 20,
  },
  // Bonuses
  deviceTrustedBonus: 10,
  // Penalties and Limits
  maxAgeSeconds: 24 * 60 * 60, // 24h
  agePenaltyFactor: 0.7,
} as const;

export type AuthAssurancePolicyConfig = typeof DEFAULT_AUTH_ASSURANCE_POLICY;
