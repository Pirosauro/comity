import { JWSInvalid, JWTExpired, JWTInvalid } from "jose/errors";

/**
 * Maps jose error types to failure reason strings for events.
 *
 * @param error - jose error instance
 * @returns Reason string for authentication-failed events
 */
export function getFailureReason(
  error: Error
): "invalid-token" | "expired" | "malformed" {
  if (error instanceof JWTExpired) {
    return "expired";
  }

  if (error instanceof JWTInvalid || error instanceof JWSInvalid) {
    return "malformed";
  }

  // JWSSignatureVerificationFailed, JWTClaimValidationFailed, or any other error
  return "invalid-token";
}
