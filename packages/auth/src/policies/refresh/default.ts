import type { AuthSessionRefreshPolicy } from "../../contracts/session-refresh-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { AuthError } from "../../error/auth.js";

/**
 * Default refresh policy with standard validation rules.
 *
 * Rules:
 * - Refresh must be enabled
 * - Refresh expiration (if present) must not be exceeded
 */
export class DefaultRefreshPolicy implements AuthSessionRefreshPolicy {
  /** @inheritdoc */
  assert(session: AuthSession, now: number): void {
    const refresh = session.refresh;

    // Refresh must be enabled
    if (!refresh || refresh.enabled !== true) {
      throw new AuthError("refresh_not_allowed", { policy: "default" });
    }

    // Refresh expiration (if present) must not be exceeded
    if (typeof refresh.expiresAt === "number" && refresh.expiresAt <= now) {
      throw new AuthError("refresh_expired", { policy: "default" });
    }
  }
}
