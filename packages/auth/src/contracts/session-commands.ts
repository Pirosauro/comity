import type { Result } from "@comity/primitives/result";
import type { AuthError } from "../errors/auth.js";
import type { AuthSessionId } from "../value-objects/auth-session-id.js";

/**
 * Metadata describing a session revocation.
 *
 * The metadata is carried with `revoke()` so that implementations can persist
 * audit-relevant context alongside the status transition. Adapters are free to
 * surface this metadata in their own audit logs.
 */
export interface AuthSessionRevocation {
  /** Domain-specific reason for revocation (e.g. "user-requested", "security-incident") */
  readonly reason: string;

  /** Timestamp when revocation occurred */
  readonly at: number;

  /** Optional information about who triggered the revocation */
  readonly actor?: {
    /** Type of actor (e.g. "system", "user", "admin") */
    readonly type: string;

    /** Identifier of the actor if applicable */
    readonly id?: string;
  };
}

/**
 * Domain command port for auth session lifecycle operations.
 *
 * Commands enforce business rules and coordinate repositories. They return
 * domain errors (`AuthError`), never raw `RepositoryError`.
 */
export interface AuthSessionCommands {
  /**
   * Revoke a session.
   *
   * @param sessionId - Session to revoke
   * @param metadata - Revocation metadata (reason, timestamp, actor)
   *
   * @returns Success, or a domain error (`session_not_found`,
   * `session_revoked`, `internal_error`).
   */
  revoke(
    sessionId: AuthSessionId,
    metadata: AuthSessionRevocation
  ): Promise<Result<void, AuthError>>;
}
