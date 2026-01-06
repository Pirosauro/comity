import type { AuthSession } from "../core/types.js";

/**
 * AuthContext Interface
 *
 * Represents a resolved authentication context containing session and optional identity information.
 *
 * Invariants:
 * - session is always present and valid
 * - identity is optional but immutable if present
 * - All properties are readonly (immutable)
 *
 * Misuse Prevention:
 * - Do not modify session or identity properties
 * - Treat context as ephemeral (re-resolve for fresh data)
 */
export interface AuthContext<
  S extends Record<string, unknown> = {},
  I extends Record<string, unknown> = {}
> {
  /**
   * Authenticated session (invariant: non-null, valid AuthSession).
   */
  readonly session: AuthSession<S>;

  /**
   * Optional resolved identity information (invariant: immutable if present).
   * Examples: user profile, service metadata, tenant info.
   */
  readonly identity?: I;
}
