import type { AuthSessionRevocationPolicy } from "../../contracts/session-revocation-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { SessionRevokedError } from "../../errors/session-revoked.js";

/**
 * Default revocation policy.
 *
 * Considers a session revoked only if expiredAt is in the past.
 */
export class ExpiredSessionRevocationPolicy implements AuthSessionRevocationPolicy {
  /** Maximum allowed age in milliseconds */
  #age: number;

  /**
   * @param age The maximum allowed age in milliseconds
   */
  constructor(age: number) {
    this.#age = age;
  }

  /**
   * @inheritdoc
   */
  assert(session: AuthSession, now: number) {
    const expiration =
      session.expiresAt !== undefined ? session.expiresAt : session.createdAt + this.#age;

    if (now >= expiration) {
      throw new SessionRevokedError({ reason: "expired" });
    }
  }
}
