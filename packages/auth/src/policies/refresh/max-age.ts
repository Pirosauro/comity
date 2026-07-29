import type { AuthSessionRefreshPolicy } from "../../contracts/session-refresh-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { AuthError } from "../../errors/auth.js";

/**
 * Refresh policy that restricts refresh based on session age.
 */
export class MaxRefreshAgePolicy implements AuthSessionRefreshPolicy {
  /** Maximum allowed age in milliseconds */
  #age: number;

  /**
   * @param age - Maximum allowed age in milliseconds
   */
  constructor(age: number) {
    this.#age = age;
  }

  /** @inheritdoc */
  assert(session: AuthSession, now: number): void {
    const age = now - session.createdAt;

    if (age > this.#age) {
      throw new AuthError("refresh_not_allowed", {
        details: {
          policy: "max_refresh_age",
        },
        context: {
          currentAge: age,
          maxAge: this.#age,
        },
      });
    }
  }
}
