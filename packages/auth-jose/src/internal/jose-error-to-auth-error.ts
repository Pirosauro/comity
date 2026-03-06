import { AuthError } from "@comity/auth/error";
import type { JOSEError } from "jose/errors";

/**
 * Maps JOSE errors to standardized JWT reasons.
 *
 * @param error - The error to map
 * @param operation - The operation being performed ("verify" or "sign")
 * @param sessionId - The ID of the session being processed (for error context)
 *
 * @returns The mapped JWT reason
 */
export function joseErrorToAuthError(
  error: unknown,
  operation: "verify" | "sign",
  sessionId?: string
): AuthError {
  const { message, code } =
    error instanceof Error ? (error as JOSEError) : { message: "Unknown error", code: "UNKNOWN" };
  const details = { adapter: "jose", code, message, ...(sessionId ? { sessionId } : {}) };

  // Signing errors are always credential/config related
  if (operation === "sign") {
    return new AuthError("invalid_credentials", {
      policy: "jwt",
      details,
    });
  }

  switch (code) {
    // Expiration
    case "ERR_JWT_EXPIRED":
      return new AuthError("token_expired", {
        policy: "jwt",
        details,
      });

    default:
      return new AuthError("token_invalid", {
        policy: "jwt",
        details,
      });
  }
}
