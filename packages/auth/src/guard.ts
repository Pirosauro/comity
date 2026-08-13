import type { AuthSessionAssurancePolicy } from "./contracts/session-assurance-policy.js";
import type { AuthSessionRefreshPolicy } from "./contracts/session-refresh-policy.js";
import type { AuthSessionRevocationPolicy } from "./contracts/session-revocation-policy.js";
import type { AuthSession } from "./contracts/session.js";
import type { AuthEvaluationObserver } from "./observers/evaluation.js";
import type { AuthRefreshEvaluationObserver } from "./observers/refresh.js";

import { toSafePayload } from "@comity/primitives/errors";
import { AuthError } from "./errors/auth.js";
import { checkSessionInvariants } from "./internal/session-invariants.js";

/** Event observer combining evaluation and refresh observers. */
interface AuthGuardObserver extends AuthEvaluationObserver, AuthRefreshEvaluationObserver {}

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

  /** Event observer */
  observer?: AuthGuardObserver;
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

  /** Event observer */
  #observer: AuthGuardObserver | undefined;

  /**
   * @param options - Policies and observer used by the guard
   */
  constructor(options: AuthGuardOptions) {
    this.#assurance = options.assurance;
    this.#revocation = options.revocation;
    this.#refresh = options.refresh;
    this.#observer = options.observer;
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
    this.#observer?.onSessionValidated({
      sessionId: session.id,
      assuranceScore: session.assurance.score,
      createdAt: session.createdAt,
      ...(session.verifiedAt ? { verifiedAt: session.verifiedAt } : {}),
      ...(session.expiresAt ? { expiresAt: session.expiresAt } : {}),
      ...(session.scopes ? { scopes: [...session.scopes] } : {}),
    });

    // 5. Refresh (if applicable)
    if (refresh && this.#refresh) {
      this.assertRefreshable(session, now);

      // Emit event
      this.#observer?.onRefreshValidated({
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
      const { reason, details } = invariant.error.meta;

      // Emit event
      this.#observer?.onSessionInvalid({
        sessionId: session.id,
        at: now,
        reason,
        ...(details?.violation ? { violation: details.violation } : {}),
        error: toSafePayload(invariant.error),
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
      const { meta } = error instanceof AuthError ? error : {};
      const { reason = "unknown", details } = meta ?? {};

      // Emit event
      this.#observer?.onAssuranceRejected({
        sessionId: session.id,
        reason,
        error: toSafePayload(error),
        ...(details?.policy ? { policy: details.policy } : {}),
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
      const { meta } = error instanceof AuthError ? error : {};
      const { reason = "unknown", details } = meta ?? {};

      // Emit event
      this.#observer?.onSessionInvalid({
        sessionId: session.id,
        at: now,
        reason,
        error: toSafePayload(error),
        ...(details?.violation ? { violation: details.violation } : {}),
        ...(details?.policy ? { policy: details.policy } : {}),
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
      const { meta } = error instanceof AuthError ? error : {};
      const { reason = "unknown", details } = meta ?? {};

      this.#observer?.onRefreshRejected({
        sessionId: session.id,
        at: session.refresh?.expiresAt ?? now,
        reason,
        error: toSafePayload(error),
        ...(details?.violation ? { violation: details.violation } : {}),
        ...(details?.policy ? { policy: details.policy } : {}),
      });

      throw error;
    }
  }
}
