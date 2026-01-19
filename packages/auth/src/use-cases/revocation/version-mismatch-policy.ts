import type { AuthSessionRevocationPolicy } from "../../contracts/session-revocation-policy.js";
import type { AuthSession } from "../../contracts/session.js";

import { SessionRevokedError } from "../../errors/session-revoked.js";

/**
 * Revokes sessions when their version is older than the current identity version.
 */
export class VersionMismatchRevocationPolicy implements AuthSessionRevocationPolicy {
  /** Version */
  #version: number;

  constructor(version: number) {
    this.#version = version;
  }

  /**
   * @inheritdoc
   */
  assert(session: AuthSession): void {
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
