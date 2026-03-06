import type { AuthSessionAssurancePolicy } from "./contracts/session-assurance-policy.js";
import type { AuthSessionRefreshPolicy } from "./contracts/session-refresh-policy.js";
import type { AuthSessionRevocationPolicy } from "./contracts/session-revocation-policy.js";
import type { AuthSession } from "./contracts/session.js";
import type { AuthEvaluationEmitter } from "./lifecycle/evaluation.js";
import type { AuthRefreshEvaluationEmitter } from "./lifecycle/refresh.js";

import { AuthError } from "./error/auth.js";
import { checkSessionInvariants } from "./internal/session-invariants.js";

/** Event emitter combining evaluation and refresh emitters. */
interface AuthGuardEmitter extends AuthEvaluationEmitter, AuthRefreshEvaluationEmitter {}

/**
 * Configuration of policies used by `AuthGuard`.
 */
export interface AuthGuardOptions {
  /** Session assurance policy */
  assurance?: AuthSessionAssurancePolicy;

  /** Session revocation policy */
  revocation?: AuthSessionRevocationPolicy;

  /** Session refresh policy */
  refresh?: AuthSessionRefreshPolicy;

  /** Event emitter */
  emitter?: AuthGuardEmitter;
}

/**
 * Orchestrates session verification using configured policies.
 *
 * Coordinates invariant checks, revocation checks and assurance policies
 * and emits evaluation events.
 */
export class AuthGuard {
  /** Session revocation policy */
  #revocation: AuthSessionRevocationPolicy | undefined;

  /** Session assurance policy */
  #assurance: AuthSessionAssurancePolicy | undefined;

  /** Session refresh policy */
  #refresh: AuthSessionRefreshPolicy | undefined;

  /** Event emitter */
  #emitter: AuthGuardEmitter | undefined;

  /**
   * @param options - Policies and emitters used by the guard
   */
  constructor(options: AuthGuardOptions) {
    this.#assurance = options.assurance;
    this.#revocation = options.revocation;
    this.#refresh = options.refresh;
    this.#emitter = options.emitter;
  }

  /**
   * Verifies that a session meets structural and policy requirements.
   *
   * @param session - Authenticated session to verify
   * @param now - Current timestamp in milliseconds
   * @param refresh - Whether to validate refresh eligibility
   *
   * @throws {AuthError} - If the session violates structural invariants
   * @throws {AuthError} - If the session is revoked by policy
   * @throws {AuthError} - If the session does not meet assurance policy
   */
  assert(session: AuthSession, now: number, refresh: boolean = false): void {
    // 1. Structural invariants
    this.assertInvariants(session, now);

    /* 2. Revocation */
    this.assertRevocation(session, now);

    // 3. Assurance
    this.assertAssurance(session, now);

    // 4. Emit event
    this.#emitter?.onSessionValidated({
      sessionId: session.id,
      assuranceScore: session.assurance.score,
      createdAt: session.createdAt,
      ...(session.verifiedAt ? { verifiedAt: session.verifiedAt } : {}),
      ...(session.expiresAt ? { expiresAt: session.expiresAt } : {}),
      ...(session.scopes ? { scopes: session.scopes } : {}),
    });

    // 5. Refresh (if applicable)
    if (refresh && this.#refresh) {
      this.assertRefreshable(session, now);

      // Emit event
      this.#emitter?.onRefreshValidated({
        sessionId: session.id,
        at: now,
      });
    }
  }

  /**
   * Validates session structural invariants and throws on failure.
   *
   * @param session - Session to validate
   * @param now - Current timestamp in milliseconds
   *
   * @throws {AuthError} - If the session violates domain invariants
   */
  assertInvariants(session: AuthSession, now: number): void {
    const invariant = checkSessionInvariants(session, now);

    if (!invariant.ok) {
      const { reason, violation, ...meta } = invariant.error.meta;

      // Emit event
      this.#emitter?.onSessionInvalid({
        sessionId: session.id,
        at: now,
        reason,
        ...(violation ? { violation } : {}),
      });

      throw invariant.error;
    }
  }

  /**
   * Ensures session meets the configured assurance policy.
   *
   * @param session - Session under evaluation
   * @param now - Current timestamp in milliseconds
   *
   * @throws {AuthError} - If assurance policy rejects the session
   */
  assertAssurance(session: AuthSession, now: number): void {
    try {
      this.#assurance?.assert(session, now);
    } catch (error) {
      // Emit event
      this.#emitter?.onAssuranceRejected({
        sessionId: session.id,
        ...(error instanceof AuthError
          ? { reason: error.meta.reason, policy: error.meta.policy }
          : {}),
      });

      throw error;
    }
  }

  /**
   * Applies the revocation policy and throws if the session is revoked.
   *
   * @param session - Session to check for revocation
   * @param now - Current timestamp in milliseconds
   *
   * @throws {AuthError} - If the session is revoked by policy
   */
  assertRevocation(session: AuthSession, now: number): void {
    try {
      this.#revocation?.assert(session, now);
    } catch (error) {
      // Emit event
      this.#emitter?.onSessionInvalid({
        sessionId: session.id,
        at: now,
        ...(error instanceof AuthError ? { reason: error.meta.reason } : {}),
      });

      throw error;
    }
  }

  /**
   * Verifies that a session is eligible for refresh according to the refresh policy.
   *
   * @param session - Authenticated session
   * @param now - Current timestamp in milliseconds
   *
   * @throws {AuthError} - If the refresh window has expired
   * @throws {AuthError} - If refresh is not allowed for the session
   */
  assertRefreshable(session: AuthSession, now: number): void {
    try {
      this.#refresh?.assert(session, now);
    } catch (error) {
      if (error instanceof AuthError) {
        this.#emitter?.onRefreshRejected({
          sessionId: session.id,
          at: session.refresh?.expiresAt ?? now,
          reason: error.meta.reason!,
        });
      }

      throw error;
    }
  }
}
