import type { Result, ResultFailure } from "@comity/primitives/result";
import type { AuthSession } from "../contracts/session.js";
import type { AuthErrorMeta, AuthErrorReason } from "../errors/auth.js";

import { AuthError } from "../errors/auth.js";

/**
 * Creates a failure `Result` representing an invalid session.
 *
 * @param reason - The reason for the invalid session
 * @param details - Additional details about the violation
 * @param context - Additional context for the error
 *
 * @returns A `ResultFailure` containing an `AuthError`
 */
function invalid(
  reason: Extract<AuthErrorReason, "session_invalid" | "assurance_invalid">,
  details: AuthErrorMeta["details"],
  context?: Record<string, unknown>
): ResultFailure<AuthError, "ok"> {
  return {
    ok: false,
    error: new AuthError(reason, {
      details: { policy: "invariants", ...details },
      ...(context ? { context } : {}),
    }),
  };
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
  if (!session.id || session.id.toString().length === 0) {
    return invalid("session_invalid", { violation: "session_id_missing" });
  }

  // Session createdAt validity
  if (typeof session.createdAt !== "number" || session.createdAt <= 0 || session.createdAt > now) {
    return invalid("session_invalid", {
      violation: "created_at_invalid",
      subject: session.id.toString(),
    });
  }

  // Session verifiedAt validity
  if (typeof session.verifiedAt === "number" && session.verifiedAt < session.createdAt) {
    return invalid("session_invalid", {
      violation: "verified_at_invalid",
      subject: session.id.toString(),
    });
  }

  // Session revokedAt validity
  if (typeof session.revokedAt === "number" && session.revokedAt < session.createdAt) {
    return invalid("session_invalid", {
      violation: "revoked_at_invalid",
      subject: session.id.toString(),
    });
  }

  // Session expiresAt validity
  if (typeof session.expiresAt === "number" && session.expiresAt <= session.createdAt) {
    return invalid("session_invalid", {
      violation: "expires_at_invalid",
      subject: session.id.toString(),
    });
  }

  // Assurance presence
  if (!session.assurance || typeof session.assurance !== "object") {
    return invalid("assurance_invalid", {
      violation: "assurance_missing",
      subject: session.id.toString(),
    });
  }

  // Assurance methods validity
  if (!Array.isArray(session.assurance.methods) || session.assurance.methods.length === 0) {
    return invalid("assurance_invalid", {
      violation: "assurance_methods_invalid",
      subject: session.id.toString(),
    });
  }

  // Assurance proof validity
  if (session.assurance.proof !== undefined && typeof session.assurance.proof !== "string") {
    return invalid("assurance_invalid", {
      violation: "assurance_proof_invalid",
      subject: session.id.toString(),
    });
  }

  // Assurance score validity
  if (typeof session.assurance.score !== "number" || session.assurance.score < 0) {
    return invalid("assurance_invalid", {
      violation: "assurance_score_invalid",
      subject: session.id.toString(),
    });
  }

  // Assurance evaluatedAt validity
  if (
    typeof session.assurance.evaluatedAt !== "number" ||
    session.assurance.evaluatedAt <= 0 ||
    session.assurance.evaluatedAt > now
  ) {
    return invalid("assurance_invalid", {
      violation: "assurance_evaluated_at_invalid",
      subject: session.id.toString(),
    });
  }

  // Assurance version validity
  if (typeof session.assurance.version !== "number" || session.assurance.version < 0) {
    return invalid("assurance_invalid", {
      violation: "assurance_version_invalid",
      subject: session.id.toString(),
    });
  }

  // Assurance context validity (if present)
  if (
    session.assurance.context !== undefined &&
    (typeof session.assurance.context !== "object" || session.assurance.context === null)
  ) {
    return invalid("assurance_invalid", {
      violation: "assurance_context_invalid",
      subject: session.id.toString(),
    });
  }

  // Session transport validity
  if (
    typeof session.transport !== "object" ||
    typeof session.transport.type !== "string" ||
    session.transport.type.length === 0
  ) {
    return invalid("session_invalid", {
      violation: "session_transport_invalid",
      subject: session.id.toString(),
    });
  }

  // Refresh validity
  if (session.refresh) {
    // Refresh enabled validity
    if (typeof session.refresh.enabled !== "boolean") {
      return invalid("session_invalid", {
        violation: "refresh_enabled_invalid",
        subject: session.id.toString(),
      });
    }

    // Refresh expiresAt validity
    if (
      typeof session.refresh.expiresAt === "number" &&
      session.refresh.expiresAt <= session.createdAt
    ) {
      return invalid("session_invalid", {
        violation: "refresh_expires_at_invalid",
        subject: session.id.toString(),
      });
    }
  }

  // Step-up validity
  if (session.stepUp) {
    // Step-up parent validity
    if (!session.stepUp.parent || session.stepUp.parent.toString().length === 0) {
      return invalid("session_invalid", {
        violation: "step_up_parent_invalid",
        subject: session.id.toString(),
      });
    }

    // Step-up at validity
    if (
      typeof session.stepUp.at !== "number" ||
      session.stepUp.at <= 0 ||
      session.stepUp.at > now
    ) {
      return invalid("session_invalid", {
        violation: "step_up_at_invalid",
        subject: session.id.toString(),
      });
    }
  }

  return { ok: true, value: undefined };
}
