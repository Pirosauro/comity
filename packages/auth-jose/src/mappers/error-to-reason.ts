import type { JOSEError } from "jose/errors";
import type { InvalidJwtReason } from "../errors/invalid-jwt.js";

import { INVALID_JWT_REASONS } from "../errors/invalid-jwt.js";

/**
 * Maps JOSE errors to standardized JWT reasons.
 *
 * @param error The error to map
 * @param operation The operation being performed ("verify" or "sign")
 * @returns The mapped JWT reason
 */
export function joseErrorToReason(error: unknown, operation: "verify" | "sign"): InvalidJwtReason {
  // Signing errors are always credential/config related
  if (operation === "sign") {
    return INVALID_JWT_REASONS.JWT_INVALID_CREDENTIAL;
  }

  const err = error instanceof Error ? (error as JOSEError) : undefined;

  const code = err?.code ?? "UNKNOWN";
  const message = err?.message ?? "";

  switch (code) {
    // Expiration
    case "ERR_JWT_EXPIRED":
      return INVALID_JWT_REASONS.JWT_TOKEN_EXPIRED;

    // Not before
    case "ERR_JWT_NOT_BEFORE":
      return INVALID_JWT_REASONS.JWT_TOKEN_NOT_ACTIVE;

    // Signature / integrity
    case "ERR_JWS_INVALID":
    case "ERR_JWS_SIGNATURE_VERIFICATION_FAILED":
      return INVALID_JWT_REASONS.JWT_SESSION_INVALID;

    // Claim validation
    case "ERR_JWT_CLAIM_VALIDATION_FAILED":
      if (message.includes("issuer") || message.includes('"iss"')) {
        return INVALID_JWT_REASONS.JWT_INVALID_ISSUER;
      }

      if (message.includes("audience") || message.includes('"aud"')) {
        return INVALID_JWT_REASONS.JWT_INVALID_AUDIENCE;
      }

      return INVALID_JWT_REASONS.JWT_TOKEN_INVALID;

    // Token structure
    case "ERR_JWT_MALFORMED":
    case "ERR_JWT_INVALID":
      return INVALID_JWT_REASONS.JWT_TOKEN_INVALID;

    // Key / algorithm
    case "ERR_JOSE_ALG_NOT_ALLOWED":
    case "ERR_JWK_INVALID":
      return INVALID_JWT_REASONS.JWT_INVALID_CREDENTIAL;

    default:
      return INVALID_JWT_REASONS.JWT_TOKEN_INVALID;
  }
}
