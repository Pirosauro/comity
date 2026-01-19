import type { AuthSessionAssurancePolicy } from "../contracts/session-assurance-policy.js";
import type { AuthSessionRefreshPolicy } from "../contracts/session-refresh-policy.js";
import type { AuthSessionRevocationPolicy } from "../contracts/session-revocation-policy.js";
import type { AuthSession } from "../contracts/session.js";
import type { AuthEvaluationEmitter } from "../events/evaluation.js";
import type { AuthRefreshEvaluationEmitter } from "../events/refresh.js";

import { BaseError } from "@comity/core/errors";
import { checkSessionInvariants } from "../contracts/session-invariants.js";
import { AssuranceRequiredError } from "../errors/assurance-required.js";
import { SessionRefreshExpiredError } from "../errors/session-refresh-expired.js";
import { SessionRevokedError } from "../errors/session-revoked.js";

/**
 * AuthGuard policies
 */
export interface AuthGuardPolicies {
  /** Session assurance policy */
  assurance: AuthSessionAssurancePolicy;

  /** Session revocation policy */
  revocation: AuthSessionRevocationPolicy;

  /** Session refresh policy */
  refresh?: AuthSessionRefreshPolicy | undefined;
}

/**
 * AuthGuard
 *
 * Orchestrates session verification:
 * - invariants
 * - revocation
 * - assurance
 *
 * Pure domain service.
 */
export class AuthGuard {
  /** Session revocation policy */
  #revocation: AuthSessionRevocationPolicy;

  /** Session assurance policy */
  #assurance: AuthSessionAssurancePolicy;

  /** Session refresh policy */
  #refresh?: AuthSessionRefreshPolicy | undefined;

  /** Event emitter */
  #events: AuthEvaluationEmitter & AuthRefreshEvaluationEmitter;

  /**
   * @param policies The policies to apply
   * @param events Event emitter
   */
  constructor(
    policies: AuthGuardPolicies,
    events: AuthEvaluationEmitter & AuthRefreshEvaluationEmitter
  ) {
    this.#assurance = policies.assurance;
    this.#revocation = policies.revocation;
    this.#refresh = policies.refresh;
    this.#events = events;
  }

  /**
   * Verifies a session
   *
   * @param session The authenticated session
   * @param context The assurance context
   * @param now The current timestamp
   * @throws SessionRevokedError
   * @throws AssuranceRequiredError
   */
  assert(session: AuthSession, now: number): void {
    // 1. Structural invariants
    const invariant = checkSessionInvariants(session, now);

    if (!invariant.ok) {
      // Emit event
      this.#events.sessionInvalid({
        sessionId: session.id,
        at: now,
        reason: invariant.error.meta["reason"] as string,
      });

      throw invariant.error;
    }

    /* 2. Revocation */
    try {
      this.#revocation.assert(session, now);
    } catch (error) {
      // Emit event
      this.#events.sessionInvalid({
        sessionId: session.id,
        at: now,
        ...(error instanceof SessionRevokedError ? { reason: error.meta["reason"] as string } : {}),
      });

      throw error;
    }
    // 3. Assurance
    try {
      this.#assurance.assert(session, now);
    } catch (error) {
      // Emit event
      this.#events.sessionRejected({
        sessionId: session.id,
        ...(error instanceof AssuranceRequiredError
          ? { reason: error.meta["reason"] as string, policy: error.meta["policy"] as string }
          : {}),
      });

      throw error;
    }

    // 4. Emit event
    this.#events.sessionValidated({
      sessionId: session.id,
      assuranceScore: session.assurance.score,
      createdAt: session.createdAt,
      ...(session.verifiedAt ? { verifiedAt: session.verifiedAt } : {}),
      ...(session.expiresAt ? { expiresAt: session.expiresAt } : {}),
      ...(session.scopes ? { scopes: session.scopes } : {}),
    });
  }

  /**
   * Verifies that a session is refreshable
   *
   * @param session The authenticated session
   * @param now The current timestamp
   * @throws SessionRevokedError
   * @throws AssuranceRequiredError
   * @throws SessionRefreshDisabledError
   * @throws SessionRefreshExpiredError
   * @throws SessionRefreshNotAllowedError
   */
  assertRefreshable(session: AuthSession, now: number): void {
    this.assert(session, now);

    if (!this.#refresh) {
      return;
    }

    try {
      this.#refresh.assert(session, now);
    } catch (error) {
      if (error instanceof SessionRefreshExpiredError) {
        // Emit event
        this.#events.refreshRejected({
          sessionId: session.id,
          at: session.refresh?.expiresAt ?? now,
          reason: "refresh_expired",
        });
      } else if (error instanceof BaseError) {
        this.#events.refreshRejected({
          sessionId: session.id,
          at: session.refresh?.expiresAt ?? now,
          reason: error.meta["reason"] as string,
        });
      }

      throw error;
    }

    // Emit event
    this.#events.refreshValidated({
      sessionId: session.id,
      at: now,
    });
  }
}
