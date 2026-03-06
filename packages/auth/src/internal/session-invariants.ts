import type { Result, ResultFailure } from "@comity/primitives/result";
import type { AuthSession } from "../contracts/session.js";
import type { AuthErrorMetaViolation, AuthErrorReason } from "../error/auth.js";

import { AuthError } from "../error/auth.js";

/**
 * Creates a failure `Result` representing an invalid session.
 *
 * @param reason - The reason for the invalid session
 * @param violation - The specific violation that occurred
 *
 * @returns A `ResultFailure` containing an `AuthError`
 */
function invalid(
  reason: Extract<AuthErrorReason, "session_invalid" | "assurance_invalid">,
  violation: AuthErrorMetaViolation
): ResultFailure<AuthError, "ok"> {
  return { ok: false, error: new AuthError(reason, { violation }) };
}

/**
 * Validates `AuthSession` structural invariants.
 *
 * @param session - The session to validate
 * @param now - The current timestamp in milliseconds
 *
 * @returns A `Result` indicating whether the session is valid or a failure
 */
export function checkSessionInvariants(
  session: AuthSession,
  now: number
): Result<void, AuthError, "ok"> {
  // Session id
  if (typeof session.id !== "string" || session.id.length === 0) {
    return invalid("session_invalid", "session_id_missing");
  }

  // Session createdAt validity
  if (typeof session.createdAt !== "number" || session.createdAt <= 0 || session.createdAt > now) {
    return invalid("session_invalid", "created_at_invalid");
  }

  // Session verifiedAt validity
  if (typeof session.verifiedAt === "number" && session.verifiedAt < session.createdAt) {
    return invalid("session_invalid", "verified_at_invalid");
  }

  // Session expiresAt validity
  if (typeof session.expiresAt === "number" && session.expiresAt <= session.createdAt) {
    return invalid("session_invalid", "expires_at_invalid");
  }

  // Assurance presence
  if (!session.assurance || typeof session.assurance !== "object") {
    return invalid("assurance_invalid", "assurance_missing");
  }

  // Assurance methods validity
  if (!Array.isArray(session.assurance.methods) || session.assurance.methods.length === 0) {
    return invalid("assurance_invalid", "assurance_methods_invalid");
  }

  // Assurance proof validity
  if (session.assurance.proof !== undefined && typeof session.assurance.proof !== "string") {
    return invalid("assurance_invalid", "assurance_proof_invalid");
  }

  // Assurance score validity
  if (typeof session.assurance.score !== "number" || session.assurance.score < 0) {
    return invalid("assurance_invalid", "assurance_score_invalid");
  }

  // Assurance evaluatedAt validity
  if (
    typeof session.assurance.evaluatedAt !== "number" ||
    session.assurance.evaluatedAt <= 0 ||
    session.assurance.evaluatedAt > now
  ) {
    return invalid("assurance_invalid", "assurance_evaluated_at_invalid");
  }

  // Assurance version validity
  if (typeof session.assurance.version !== "number" || session.assurance.version < 0) {
    return invalid("assurance_invalid", "assurance_version_invalid");
  }

  // Assurance context validity (if present)
  if (
    session.assurance.context !== undefined &&
    (typeof session.assurance.context !== "object" || session.assurance.context === null)
  ) {
    return invalid("assurance_invalid", "assurance_context_invalid");
  }

  // Session transport validity
  if (
    typeof session.transport !== "object" ||
    typeof session.transport.type !== "string" ||
    session.transport.type.length === 0
  ) {
    return invalid("session_invalid", "session_transport_invalid");
  }

  // Refresh validity
  if (session.refresh) {
    // Refresh enabled validity
    if (typeof session.refresh.enabled !== "boolean") {
      return invalid("session_invalid", "refresh_enabled_invalid");
    }

    // Refresh expiresAt validity
    if (
      typeof session.refresh.expiresAt === "number" &&
      session.refresh.expiresAt <= session.createdAt
    ) {
      return invalid("session_invalid", "refresh_expires_at_invalid");
    }
  }

  // Step-up validity
  if (session.stepUp) {
    // Step-up parent validity
    if (typeof session.stepUp.parent !== "string" || session.stepUp.parent.length === 0) {
      return invalid("session_invalid", "step_up_parent_invalid");
    }

    // Step-up at validity
    if (
      typeof session.stepUp.at !== "number" ||
      session.stepUp.at <= 0 ||
      session.stepUp.at > now
    ) {
      return invalid("session_invalid", "step_up_at_invalid");
    }
  }

  return { ok: true, value: undefined };
}
