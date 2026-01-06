import type { JOSEError } from "jose/errors";

/**
 * Maps JOSE library errors to standardized JWT error reasons.
 *
 * @remarks
 * This function centralizes error mapping logic to ensure consistency
 * across different JOSE versions and error formats.
 *
 * @param error - The error thrown by JOSE library
 * @param operation - Whether the error occurred during verification or signing
 * @returns Corresponding standardized error reason
 */
export function mapJoseErrorToReason(
  error: unknown,
  operation: "verify" | "sign"
): JoseJwtVerifyReason | JoseJwtSignReason {
  if (operation === "sign") {
    return "auth:jwt_invalid_credential";
  }

  // Extract JOSE error code and message
  const { code, message } =
    error instanceof Error
      ? {
          code: (error as JOSEError).code ?? "UNKNOWN",
          message: error.message || String(error),
        }
      : { code: "UNKNOWN", message: String(error) };

  // Map using simple switch statement
  switch (code) {
    // Expiration
    case "ERR_JWT_EXPIRED":
      return "auth:jwt_token_expired";

    // Signature
    case "ERR_JWS_INVALID":
    case "ERR_JWS_SIGNATURE_VERIFICATION_FAILED":
      return "auth:jwt_session_invalid";

    // Claim validation
    case "ERR_JWT_CLAIM_VALIDATION_FAILED":
      if (message.includes("issuer") || message.includes('"iss"')) {
        return "auth:jwt_invalid_issuer";
      }

      if (message.includes("audience") || message.includes('"aud"')) {
        return "auth:jwt_invalid_audience";
      }

      if (message.includes("not before") || message.includes('"nbf"')) {
        return "auth:jwt_token_not_active";
      }

      // Fallback for other claim errors
      return "auth:jwt_token_invalid";

    // Token structure
    case "ERR_JWT_MALFORMED":
    case "ERR_JWT_INVALID":
      return "auth:jwt_token_invalid";

    // Configuration/Key errors
    case "ERR_JOSE_ALG_NOT_ALLOWED":
    case "ERR_JWK_INVALID":
      return "auth:jwt_invalid_credential";

    // Default case
    default:
      return "auth:jwt_token_invalid";
  }
}
