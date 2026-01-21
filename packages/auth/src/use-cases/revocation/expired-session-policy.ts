import type { AuthSessionRevocationPolicy } from "../../contracts/session-revocation-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { SessionRevokedError } from "../../errors/session-revoked.js";

/**
 * Revocation policy that considers sessions expired based on time.
 *
 * Considers a session revoked if it has exceeded its expiration time or maximum age.
 */
export class ExpiredSessionRevocationPolicy implements AuthSessionRevocationPolicy {
  /** Maximum allowed age in milliseconds */
  #age: number;

  /**
   * @param age - Maximum allowed age in milliseconds
   */
  constructor(age: number) {
    this.#age = age;
  }

  /** @inheritdoc */
  assert(session: AuthSession, now: number) {
    // Use the earliest applicable expiry: explicit expiresAt, or fallback to createdAt + age
    const explicitExpiry = session.expiresAt;
    const fallbackExpiry = session.createdAt + this.#age;

    const expiration =
      typeof explicitExpiry === "number"
        ? Math.min(explicitExpiry, fallbackExpiry)
        : fallbackExpiry;

    if (now >= expiration) {
      throw new SessionRevokedError({ reason: "expired" });
    }
  }
}
