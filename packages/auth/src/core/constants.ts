/**
 * AuthMethod describes *how authentication was performed*.
 *
 * Invariants:
 * - Values are immutable and case-sensitive
 * - Used only for assurance scoring, not direct security decisions
 *
 * Misuse Prevention:
 * - Do not use AuthMethod alone to infer session validity
 * - Assurance is always derived by policy from method combinations
 */
export const AUTH_METHODS = {
  /** Knowledge factors (invariant: requires user knowledge) */
  PASSWORD: "password", // password, PIN, shared secret

  /** Possession factors (invariant: requires user possession) */
  OTP: "otp", // TOTP, SMS, email OTP (delivery channel irrelevant here)
  PUSH_AUTH: "push_auth", // push confirmation on trusted device

  /** Inherence factors (invariant: requires user biometrics) */
  BIOMETRIC: "biometric", // biometric verification (never standalone)

  /** Hardware / Passkeys (invariant: requires physical token) */
  PASSKEY: "passkey", // WebAuthn passkey (may embed biometric)
  HARDWARE_TOKEN: "hardware_token", // YubiKey, smart card, etc.
} as const;

export type AuthMethod = (typeof AUTH_METHODS)[keyof typeof AUTH_METHODS];

/**
 * IdentityProof describes WHO asserted the user's identity.
 *
 * Invariants:
 * - Does NOT imply authentication strength (only attestation source)
 * - Values are protocol-specific identifiers
 *
 * Misuse Prevention:
 * - Do not use for assurance scoring (use AuthMethod instead)
 */
export const AUTH_IDENTITY_PROOFS = {
  /** OAuth 2.0 (invariant: external OAuth provider attested) */
  OAUTH2: "oauth2",

  /** OpenID Connect (invariant: OIDC provider attested) */
  OIDC: "oidc",

  /** SAML 2.0 (invariant: SAML IdP attested) */
  SAML2: "saml2",
} as const;

export type AuthIdentityProof =
  (typeof AUTH_IDENTITY_PROOFS)[keyof typeof AUTH_IDENTITY_PROOFS];

/**
 * AuthSessionTransport describes *how an authenticated session is conveyed* between client and server.
 *
 * Invariants:
 * - Values represent transport mechanisms, not security properties
 * - Session validity is independent of transport
 *
 * Misuse Prevention:
 * - Do not infer assurance from transport type
 * - Transport can be changed without affecting session security
 */
export const AUTH_SESSION_TRANSPORTS = {
  /** JWT-based transport (invariant: stateless, token-based) */
  JWT: "jwt",

  /** Cookie-based transport (invariant: stateful, server-side) */
  COOKIE: "cookie",

  /** Header-based transport (invariant: per-request, API-style) */
  HEADER: "header",

  /** API key transport (invariant: long-lived, service-level) */
  API_KEY: "api_key",
} as const;

export type AuthSessionTransport =
  (typeof AUTH_SESSION_TRANSPORTS)[keyof typeof AUTH_SESSION_TRANSPORTS];
