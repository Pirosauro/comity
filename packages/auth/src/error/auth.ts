import type { ErrorMeta } from "@comity/primitives/error";

import { BaseError } from "@comity/primitives/error";

/**
 * Reasons for authentication errors.
 *
 * @remarks
 * These reasons are used to categorize different types of authentication failures.
 *
 * - `session_invalid`: The session object violates structural domain invariants. Use only for internal model validation failures.
 * - `session_expired`: The session has expired according to its expiration timestamp.
 * - `session_revoked`: The session has been explicitly revoked by policy or storage.
 * - `session_not_found`: The session was not found in the repository.
 * - `refresh_expired`: The refresh window has expired and refresh is no longer possible.
 * - `refresh_not_allowed`: Refresh is not allowed by policy (e.g. disabled or age limit exceeded).
 * - `refresh_required`: A refresh is required to continue.
 * - `assurance_required`: An assurance evaluation is required but not present.
 * - `assurance_invalid`: The assurance object is structurally invalid or inconsistent. Do NOT use for policy failures.
 * - `assurance_expired`: The assurance evaluation is too old and no longer valid.
 * - `assurance_context_mismatch`: The assurance context does not satisfy required bounds.
 * - `assurance_step_up_required`: A step-up verification is required before continuing.
 * - `assurance_too_low`: The assurance score is below the required threshold.
 * - `token_invalid`: The provided token is malformed, invalid or cannot be verified.
 * - `token_expired`: The provided token has expired.
 * - `authentication_required`: No valid authentication credentials were provided.
 * - `forbidden`: The authenticated subject is not allowed to access the resource.
 * - `invalid_credentials`: The provided credentials are incorrect.
 * - `conflict`: The request conflicts with the current authentication state.
 */
export type AuthErrorReason =
  | "session_invalid"
  | "session_expired"
  | "session_revoked"
  | "session_not_found"
  | "refresh_expired"
  | "refresh_not_allowed"
  | "refresh_required"
  | "assurance_required"
  | "assurance_invalid"
  | "assurance_expired"
  | "assurance_context_mismatch"
  | "assurance_step_up_required"
  | "assurance_too_low"
  | "token_invalid"
  | "token_expired"
  | "authentication_required"
  | "forbidden"
  | "invalid_credentials"
  | "conflict"
  | "internal_error"; // catch-all for unexpected errors (e.g. infrastructure failures). Must not be used for domain-level errors.

/**
 * Authentication error metadata violations.
 *
 * @remarks
 * These violations provide specific details about why a session is considered invalid.
 * They are used as metadata in `AuthError` instances when the reason is `session_invalid`.
 * They should NOT be used for policy-level errors, which should use specific reasons instead.
 *
 * - `session_id_missing`: The session ID is missing or not a valid string.
 * - `created_at_invalid`: The session's `createdAt` timestamp is missing, not a number, or in the future.
 * - `verified_at_invalid`: The session's `verifiedAt` timestamp is before `createdAt`.
 * - `expires_at_invalid`: The session's `expiresAt` timestamp is before or equal to `createdAt`.
 * - `assurance_missing`: The session's assurance object is missing or not an object.
 * - `assurance_methods_invalid`: The session's assurance methods are missing or not a non-empty array.
 * - `assurance_proof_invalid`: The session's assurance proof is invalid (e.g. missing when required).
 * - `assurance_score_invalid`: The session's assurance score is invalid (e.g. not a number or out of range).
 * - `assurance_evaluated_at_invalid`: The session's assurance evaluatedAt timestamp is invalid (e.g. not a number or in the future).
 * - `assurance_version_invalid`: The session's assurance version is invalid (e.g. not a number).
 * - `assurance_context_invalid`: The session's assurance context is invalid (e.g. not an object).
 * - `session_transport_invalid`: The session's transport mechanism is invalid or unsupported.
 * - `refresh_enabled_invalid`: The session's refresh configuration is invalid (e.g. enabled but missing parameters).
 * - `refresh_expires_at_invalid`: The session's refresh expiration timestamp is invalid (e.g. not a number or in the past).
 * - `step_up_parent_invalid`: The session's step-up parent reference is invalid (e.g. missing or not a valid session ID).
 * - `step_up_at_invalid`: The session's step-up timestamp is invalid (e.g. not a number or in the future).
 */
export type AuthErrorMetaViolation =
  | "session_id_missing"
  | "created_at_invalid"
  | "verified_at_invalid"
  | "expires_at_invalid"
  | "assurance_missing"
  | "assurance_methods_invalid"
  | "assurance_proof_invalid"
  | "assurance_score_invalid"
  | "assurance_evaluated_at_invalid"
  | "assurance_version_invalid"
  | "assurance_context_invalid"
  | "session_transport_invalid"
  | "refresh_enabled_invalid"
  | "refresh_expires_at_invalid"
  | "step_up_parent_invalid"
  | "step_up_at_invalid";

/**
 * Auth Error metadata.
 */
export interface AuthErrorMeta extends ErrorMeta {
  /**
   * The reason for the authentication error. This categorizes the type of failure and is used for error handling logic.
   */
  readonly reason: AuthErrorReason;

  /**
   * Optional subject identifier (user/session/etc). Must NOT contain sensitive data.
   */
  readonly subject?: string;

  /**
   * Optional retriable hint.
   */
  readonly retriable?: boolean;

  /**
   * Optional violation details.
   */
  readonly violation?: AuthErrorMetaViolation;

  /**
   * Optional policy identifier that triggered the error, if applicable.
   */
  readonly policy?: string;

  /**
   * Optional additional details relevant to the error. Must NOT contain sensitive data.
   */
  readonly details?: Record<string, unknown>;
}

/** Error messages for auth errors */
const REASON_MESSAGES: Record<AuthErrorReason, string> = {
  session_invalid: "Session is invalid",
  session_expired: "Session has expired",
  session_revoked: "Session has been revoked",
  session_not_found: "Session not found",
  refresh_expired: "Refresh window has expired",
  refresh_not_allowed: "Refresh is not allowed by policy",
  refresh_required: "Session refresh is required",
  assurance_required: "Assurance evaluation is required",
  assurance_invalid: "Assurance evaluation is invalid",
  assurance_expired: "Assurance evaluation has expired",
  assurance_context_mismatch: "Assurance context does not satisfy required bounds",
  assurance_step_up_required: "Step-up verification is required",
  assurance_too_low: "Assurance score is below the required threshold",
  token_invalid: "Token is invalid",
  token_expired: "Token has expired",
  authentication_required: "Authentication credentials are required",
  forbidden: "Access denied",
  invalid_credentials: "Invalid authentication credentials",
  conflict: "Authentication conflict",
  internal_error: "Internal error",
};
/** Error HTTP status codes for auth errors */
const REASON_HTTP_STATUS: Record<AuthErrorReason, number> = {
  session_invalid: 401,
  session_expired: 401,
  session_revoked: 401,
  session_not_found: 404,
  refresh_expired: 401,
  refresh_not_allowed: 403,
  refresh_required: 401,
  assurance_required: 403,
  assurance_invalid: 403,
  assurance_expired: 403,
  assurance_context_mismatch: 403,
  assurance_step_up_required: 403,
  assurance_too_low: 403,
  token_invalid: 401,
  token_expired: 401,
  authentication_required: 401,
  forbidden: 403,
  invalid_credentials: 401,
  conflict: 409,
  internal_error: 500,
};

/**
 * Auth Error.
 */
export class AuthError extends BaseError<AuthErrorMeta> {
  /** Error code */
  readonly code: `auth:${AuthErrorReason}`;

  /**
   * @param reason - The reason for the auth error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: AuthErrorReason, meta?: Omit<AuthErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `auth:${reason}`;
  }
}
