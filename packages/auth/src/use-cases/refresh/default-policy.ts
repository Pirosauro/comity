import type { AuthSessionRefreshPolicy } from "../../contracts/session-refresh-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { SessionRefreshExpiredError } from "../../errors/session-refresh-expired.js";
import { SessionRefreshNotAllowedError } from "../../errors/session-refresh-not-allowed.js";

/**
 * Default refresh policy.
 *
 * Rules:
 * - refresh must be enabled
 * - refresh expiration (if present) must not be exceeded
 */
export class DefaultRefreshPolicy implements AuthSessionRefreshPolicy {
  /**
   * @inheritdoc
   */
  assert(session: AuthSession): void {
    const refresh = session.refresh;

    // Refresh must be enabled
    if (!refresh || refresh.enabled !== true) {
      throw new SessionRefreshNotAllowedError({ reason: "session_refresh_disabled" });
    }

    // Refresh expiration (if present) must not be exceeded
    if (typeof refresh.expiresAt === "number" && refresh.expiresAt <= Date.now()) {
      throw new SessionRefreshExpiredError();
    }
  }
}
