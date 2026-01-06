import type { AuthSession } from "./types.js";

/**
 * Session utility functions.
 *
 * Invariants:
 * - All functions are pure (no side effects)
 * - Time calculations use seconds since epoch
 * - Functions handle undefined values gracefully
 */

/**
 * Returns true if the session has expired.
 *
 * Invariants:
 * - Hard expiration takes precedence over policy-based expiration
 * - maxAgeSeconds is optional and overrides session.expiresAt if shorter
 *
 * Misuse Prevention:
 * - Do not call with negative timestamps
 * - Understand that undefined expiresAt means no hard expiration
 */
export function isSessionExpired(
  session: AuthSession,
  now: number,
  maxAgeSeconds?: number // Seconds
): boolean {
  // Hard cap always wins (intent: absolute expiration)
  if (session.expiresAt !== undefined && now >= session.expiresAt) {
    return true;
  }

  // Policy-based expiration (intent: configurable max age)
  if (
    maxAgeSeconds !== undefined &&
    getSessionAge(session, now) > maxAgeSeconds
  ) {
    return true;
  }

  return false;
}

/**
 * Returns the age of the session in seconds.
 *
 * Invariants:
 * - Always returns a non-negative number
 * - Calculated as now - session.createdAt
 */
export function getSessionAge(session: AuthSession, now: number): number {
  return now - session.createdAt;
}

/**
 * Returns the age since last strong authentication in seconds.
 *
 * Invariants:
 * - Returns Infinity if session.verifiedAt is undefined (never verified)
 * - Otherwise returns now - session.verifiedAt
 *
 * Misuse Prevention:
 * - Check for Infinity before comparisons
 */
export function getVerificationAge(session: AuthSession, now: number): number {
  if (session.verifiedAt === undefined) {
    return Infinity;
  }

  return now - session.verifiedAt;
}

/**
 * Returns true if verification is within the specified age window.
 *
 * Invariants:
 * - Returns false if session.expiresAt is undefined (no hard expiration)
 * - Age calculation uses session.verifiedAt
 *
 * Misuse Prevention:
 * - Ensure maxAgeSeconds is positive
 * - Understand that this is temporal, not security validation
 */
export function isVerificationFresh(
  session: AuthSession,
  now: number,
  maxAgeSeconds: number
): boolean {
  if (session.expiresAt === undefined) {
    return false;
  }

  return now - session.verifiedAt <= maxAgeSeconds;
}
