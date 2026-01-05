/**
 * AuthMethod describes *how authentication was performed*.
 *
 * IMPORTANT:
 * - AuthMethod alone MUST NOT be used to infer assurance.
 * - Assurance is always derived by policy from a combination of:
 *   methods, device trust, freshness, context, and verification steps.
 */
export const AUTH_METHODS = {
  /** Knowledge factors */
  PASSWORD: "password", // password, PIN, shared secret

  /** Possession factors */
  OTP: "otp", // TOTP, SMS, email OTP (delivery channel irrelevant here)
  PUSH_AUTH: "push_auth", // push confirmation on trusted device

  /** Inherence factors */
  BIOMETRIC: "biometric", // biometric verification (never standalone)

  /** Hardware / Passkeys */
  PASSKEY: "passkey", // WebAuthn passkey (may embed biometric)
  HARDWARE_TOKEN: "hardware_token", // YubiKey, smart card, etc.
} as const;

export type AuthMethod = (typeof AUTH_METHODS)[keyof typeof AUTH_METHODS];

/**
 * IdentityProof describes WHO asserted the user's identity.
 *
 * This does NOT imply authentication strength.
 */
export const AUTH_IDENTITY_PROOFS = {
  /** OAuth 2.0 */
  OAUTH2: "oauth2",

  /** OpenID Connect */
  OIDC: "oidc",

  /** SAML 2.0 */
  SAML2: "saml2",
} as const;

export type AuthIdentityProof =
  (typeof AUTH_IDENTITY_PROOFS)[keyof typeof AUTH_IDENTITY_PROOFS];

/**
 * AuthSessionTransport describes *how an authenticated session is conveyed* between client and server.
 *
 * IMPORTANT:
 * - Assurance tiers are policy-derived.
 * - They MUST NOT be arbitrarily assigned by adapters or callers.
 */
export const AUTH_SESSION_TRANSPORTS = {
  /** JWT-based session transport */
  JWT: "jwt",

  /** Cookie-based session transport */
  COOKIE: "cookie",

  /** Header-based session transport */
  HEADER: "header",

  /** API key-based session transport */
  API_KEY: "api_key",
};

export type AuthSessionTransport =
  (typeof AUTH_SESSION_TRANSPORTS)[keyof typeof AUTH_SESSION_TRANSPORTS];
