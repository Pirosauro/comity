import type { AuthSessionRefreshPolicy } from "../../contracts/session-refresh-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { SessionRefreshNotAllowedError } from "../../errors/session-refresh-not-allowed.js";

/**
 * Restricts refresh based on session age.
 */
export class MaxRefreshAgePolicy implements AuthSessionRefreshPolicy {
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
  assert(session: AuthSession, now: number): void {
    const age = now - session.createdAt;

    if (age > this.#age) {
      throw new SessionRefreshNotAllowedError({
        reason: "max_refresh_age_exceeded",
        currentAge: age,
        maxAge: this.#age,
      });
    }
  }
}
