import type { AuthSession } from "../core/types.js";

export interface AuthContext<
  S extends Record<string, unknown> = {},
  I extends Record<string, unknown> = {}
> {
  /**
   * Authenticated session.
   */
  readonly session: AuthSession<S>;

  /**
   * Optional resolved identity information.
   * (user, service, tenant, etc.)
   */
  readonly identity?: I;
}
