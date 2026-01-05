import type { AuthSession } from "../../core/types.js";
import type { Result } from "../../core/types.js";

/**
 * Maps verified JWT claims into an AuthSession.
 *
 * IMPORTANT:
 * - This function is adapter-level.
 * - It is responsible for interpreting JWT claims
 *   and constructing a valid AuthSession.
 * - Mapping MAY fail due to missing or invalid claims.
 */
export type JwtSessionMapper<
  C extends Record<string, unknown>,
  S extends Record<string, unknown> = {},
  R extends string = string
> = (claims: C) => Result<AuthSession<S>, R>;
