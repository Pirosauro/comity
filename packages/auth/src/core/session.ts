import type { AuthSession } from "./types.js";

/**
 * Returns true if the session has a hard expiration
 * and the current time is past that expiration.
 *
 * IMPORTANT:
 * - Absence of expiresAt means "no hard expiration",
 *   NOT infinite validity (validation/policy decide that).
 */
export function isSessionExpired(
  session: AuthSession,
  now: number,
  maxAgeSeconds?: number // Seconds
): boolean {
  // 1. Hard cap always wins
  if (session.expiresAt !== undefined && now >= session.expiresAt) {
    return true;
  }

  // 2. Policy-based expiration
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
 */
export function getSessionAge(session: AuthSession, now: number): number {
  return now - session.createdAt;
}

/**
 * Returns the age (in seconds) since the last strong authentication.
 *
 * NOTE:
 * - verifiedAt represents the last completed strong auth step
 *   (password + 2FA, passkey, step-up, etc.).
 */
export function getVerificationAge(session: AuthSession, now: number): number {
  if (session.verifiedAt === undefined) {
    return Infinity;
  }

  return now - session.verifiedAt;
}

/**
 * Returns true if the session is within a given verification age window.
 *
 * IMPORTANT:
 * - This helper does NOT decide validity by itself.
 *   It only answers a temporal question.
 * - verification freshness makes sense only if verifiedAt is set,
 *   as it represents the last completed strong auth step.
 */
export function isVerificationFresh(
  session: AuthSession,
  now: number,
  maxAgeSeconds: number
): boolean {
  if (session.verifiedAt === undefined) {
    return false;
  }

  return now - session.verifiedAt <= maxAgeSeconds;
}
