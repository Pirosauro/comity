import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { AuthSessionId } from "../value-objects/auth-session-id.js";
import type { AuthSession } from "./session.js";

/**
 * Metadata describing a session revocation.
 *
 * The metadata is carried with `revoke()` so that adapters can persist
 * audit-relevant context alongside the deletion. Adapters are free to
 * surface this metadata in their own audit logs.
 */
export interface AuthSessionRevocation {
  /** Session identifier to revoke */
  readonly id: AuthSessionId;

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
 * Repository for authentication sessions.
 *
 * @remarks
 * `revoke()` is intentionally retained on this contract. It sits at the
 * boundary between persistence (delete the session row) and a domain
 * command (invalidate an authenticated session, with audit metadata).
 * Splitting it into a separate command service is a candidate for a
 * future Repository-vs-Domain-Command ADR; in this pass the operation is
 * kept here because it is the only write that mutates session state with
 * non-CRUD semantics.
 */
export interface AuthSessionRepository {
  /**
   * Retrieve a session by its identifier.
   *
   * @returns The session, or a failure with `session_not_found` when no
   * session exists for the given identifier.
   */
  getById(id: AuthSessionId): Promise<Result<AuthSession | null, RepositoryError>>;

  /**
   * Persist a session.
   *
   * @remarks
   * Implementations MUST treat this as upsert: if the session id already
   * exists the stored session is overwritten, otherwise a new session is
   * created. This covers both `create` and `update` flows from the
   * previous contract without forcing callers to distinguish them.
   */
  save(session: AuthSession): Promise<Result<void, RepositoryError>>;

  /**
   * Revoke a session.
   *
   * @remarks
   * Adapters persist the revocation metadata for audit purposes. The
   * operation is idempotent: revoking an already revoked session is not
   * an error.
   */
  revoke(revocation: AuthSessionRevocation): Promise<Result<void, RepositoryError>>;
}
