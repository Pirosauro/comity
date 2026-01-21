import type { Result, ResultFailure } from "@comity/core/result";
import type { AuthSession } from "./session.js";

import { InvalidSessionError } from "../errors/invalid-session.js";

/**
 * Reasons why an AuthSession violates domain invariants.
 *
 * These reasons are stable, machine-readable and adapter-agnostic.
 */
export const AUTH_SESSION_INVARIANT_REASONS = {
  SESSION_ID_MISSING: "session_id_missing",
  CREATED_AT_INVALID: "created_at_invalid",
  VERIFIED_AT_INVALID: "verified_at_invalid",
  EXPIRES_AT_INVALID: "expires_at_invalid",
  ASSURANCE_MISSING: "assurance_missing",
  ASSURANCE_METHODS_INVALID: "assurance_methods_invalid",
  ASSURANCE_PROOF_INVALID: "assurance_proof_invalid",
  ASSURANCE_SCORE_INVALID: "assurance_score_invalid",
  ASSURANCE_EVALUATED_AT_INVALID: "assurance_evaluated_at_invalid",
  ASSURANCE_VERSION_INVALID: "assurance_version_invalid",
  ASSURANCE_CONTEXT_INVALID: "assurance_context_invalid",
  SESSION_TRANSPORT_INVALID: "session_transport_invalid",
  REFRESH_ENABLED_INVALID: "refresh_enabled_invalid",
  REFRESH_EXPIRES_AT_INVALID: "refresh_expires_at_invalid",
  STEP_UP_PARENT_INVALID: "step_up_parent_invalid",
  STEP_UP_AT_INVALID: "step_up_at_invalid",
} as const;

/**
 * Session invariant reasons
 */
export type AuthSessionInvariantReason =
  (typeof AUTH_SESSION_INVARIANT_REASONS)[keyof typeof AUTH_SESSION_INVARIANT_REASONS];

/**
 * Creates a failure `Result` representing an invalid session.
 *
 * @param reason - The reason for the invalid session
 * @returns A `ResultFailure` containing an `InvalidSessionError`
 */
function invalid(
  reason: AuthSessionInvariantReason
): ResultFailure<InvalidSessionError<AuthSessionInvariantReason>, "ok"> {
  return { ok: false, error: new InvalidSessionError({ reason }) };
}

/**
 * Validates `AuthSession` structural invariants.
 *
 * @param session - The session to validate
 * @param now - The current timestamp in milliseconds
 * @returns A `Result` indicating whether the session is valid or a failure
 */
export function checkSessionInvariants(
  session: AuthSession,
  now: number
): Result<void, InvalidSessionError<AuthSessionInvariantReason>, "ok"> {
  // Session id
  if (typeof session.id !== "string" || session.id.length === 0) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.SESSION_ID_MISSING);
  }

  // Session createdAt validity
  if (typeof session.createdAt !== "number" || session.createdAt <= 0 || session.createdAt > now) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.CREATED_AT_INVALID);
  }

  // Session verifiedAt validity
  if (typeof session.verifiedAt === "number" && session.verifiedAt < session.createdAt) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.VERIFIED_AT_INVALID);
  }

  // Session expiresAt validity
  if (typeof session.expiresAt === "number" && session.expiresAt <= session.createdAt) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.EXPIRES_AT_INVALID);
  }

  // Assurance presence
  if (!session.assurance || typeof session.assurance !== "object") {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_MISSING);
  }

  // Assurance methods validity
  if (!Array.isArray(session.assurance.methods) || session.assurance.methods.length === 0) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_METHODS_INVALID);
  }

  // Assurance proof validity
  if (session.assurance.proof !== undefined && typeof session.assurance.proof !== "string") {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_PROOF_INVALID);
  }

  // Assurance score validity
  if (typeof session.assurance.score !== "number" || session.assurance.score < 0) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_SCORE_INVALID);
  }

  // Assurance evaluatedAt validity
  if (
    typeof session.assurance.evaluatedAt !== "number" ||
    session.assurance.evaluatedAt <= 0 ||
    session.assurance.evaluatedAt > now
  ) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_EVALUATED_AT_INVALID);
  }

  // Assurance version validity
  if (typeof session.assurance.version !== "number" || session.assurance.version < 0) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_VERSION_INVALID);
  }

  // Assurance context validity (if present)
  if (
    session.assurance.context !== undefined &&
    (typeof session.assurance.context !== "object" || session.assurance.context === null)
  ) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.ASSURANCE_CONTEXT_INVALID);
  }

  // Session transport validity
  if (
    typeof session.transport !== "object" ||
    typeof session.transport.type !== "string" ||
    session.transport.type.length === 0
  ) {
    return invalid(AUTH_SESSION_INVARIANT_REASONS.SESSION_TRANSPORT_INVALID);
  }

  // Refresh validity
  if (session.refresh) {
    // Refresh enabled validity
    if (typeof session.refresh.enabled !== "boolean") {
      return invalid(AUTH_SESSION_INVARIANT_REASONS.REFRESH_ENABLED_INVALID);
    }

    // Refresh expiresAt validity
    if (
      typeof session.refresh.expiresAt === "number" &&
      session.refresh.expiresAt <= session.createdAt
    ) {
      return invalid(AUTH_SESSION_INVARIANT_REASONS.REFRESH_EXPIRES_AT_INVALID);
    }
  }

  // Step-up validity
  if (session.stepUp) {
    // Step-up parent validity
    if (typeof session.stepUp.parent !== "string" || session.stepUp.parent.length === 0) {
      return invalid(AUTH_SESSION_INVARIANT_REASONS.STEP_UP_PARENT_INVALID);
    }

    // Step-up at validity
    if (
      typeof session.stepUp.at !== "number" ||
      session.stepUp.at <= 0 ||
      session.stepUp.at > now
    ) {
      return invalid(AUTH_SESSION_INVARIANT_REASONS.STEP_UP_AT_INVALID);
    }
  }

  return { ok: true, value: undefined };
}
