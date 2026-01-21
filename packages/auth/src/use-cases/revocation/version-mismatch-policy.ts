import type { AuthSessionRevocationPolicy } from "../../contracts/session-revocation-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { SessionRevokedError } from "../../errors/session-revoked.js";

/**
 * Revocation policy that revokes sessions with outdated version numbers.
 */
export class VersionMismatchRevocationPolicy implements AuthSessionRevocationPolicy {
  /** Current expected version */
  #version: number;

  /**
   * @param version - Expected minimum version
   */
  constructor(version: number) {
    this.#version = version;
  }

  /** @inheritdoc */
  assert(session: AuthSession, now: number): void {
    const version = session.assurance.version;

    if (typeof version !== "number" || version < this.#version) {
      throw new SessionRevokedError({
        reason: "version_mismatch",
        expectedVersion: this.#version,
        actualVersion: version,
      });
    }
  }
}
