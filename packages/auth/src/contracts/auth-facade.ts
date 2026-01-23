import type { CreateSessionInput } from "../use-cases/session-create.js";
import type { RefreshSessionInput } from "../use-cases/session-refresh.js";
import type { RevokeSessionInput } from "../use-cases/session-revoke.js";
import type { StepUpSessionInput } from "../use-cases/session-step-up.js";
import type { AuthSession } from "./session.js";

/**
 * Authentication facade contract.
 *
 * Provides a clean, stateless API for session lifecycle management.
 * All operations are synchronous or return promises; none maintain state.
 */
export interface AuthFacade {
  /**
   * Create a new authenticated session.
   *
   * Builds a new session, evaluates assurance, validates invariants,
   * and persists the session to the repository.
   *
   * @param input - Session creation input including identity, methods, and transport
   * @param now - Current timestamp in milliseconds (must be accurate)
   * @returns The created authenticated session
   * @throws {InvalidSessionError} - If session invariants are violated
   * @throws {AssuranceRequiredError} - If assurance policy rejects the session
   */
  createSession(input: CreateSessionInput, now: number): Promise<AuthSession>;

  /**
   * Validate an existing session.
   *
   * Checks structural invariants, revocation status, assurance level,
   * and refresh window constraints.
   *
   * @param session - The session to validate
   * @param now - Current timestamp in milliseconds
   * @throws {InvalidSessionError} - If session is invalid or expired
   * @throws {SessionRevokedError} - If session is revoked
   * @throws {AssuranceRequiredError} - If session doesn't meet assurance requirements
   */
  assertSession(session: AuthSession, now: number): void;

  /**
   * Refresh an existing session.
   *
   * Validates the original session, creates a new session instance with
   * rotated ID, and preserves authentication history.
   *
   * @param input - Refresh input including new ID and optional expiration
   * @param now - Current timestamp in milliseconds
   * @returns The refreshed session with new ID
   * @throws {InvalidSessionError} - If original session is invalid or missing
   * @throws {SessionRefreshExpiredError} - If refresh window has passed
   * @throws {SessionRefreshNotAllowedError} - If refresh policy rejects it
   */
  refreshSession(input: RefreshSessionInput, now: number): Promise<AuthSession>;

  /**
   * Revoke an existing session.
   *
   * Immediately invalidates a session. Subsequent assertions will fail.
   *
   * @param input - Revocation input including session ID and reason
   * @param now - Current timestamp in milliseconds
   * @throws {InvalidSessionError} - If session not found
   */
  revokeSession(input: RevokeSessionInput, now: number): Promise<void>;

  /**
   * Perform step-up authentication.
   *
   * Creates a child session with stronger assurance requirements,
   * linked to the parent session for audit purposes.
   *
   * @param input - Step-up input including parent session and step context
   * @param now - Current timestamp in milliseconds
   * @returns The new step-up session
   * @throws {InvalidSessionError} - If parent session is invalid
   * @throws {AssuranceRequiredError} - If stronger assurance is not met
   */
  stepUpSession(input: StepUpSessionInput, now: number): Promise<AuthSession>;
}
