import type { Result } from "../../core/types.js";

/**
 * Generic JWT facade.
 *
 * - NOT jose-specific
 * - NOT HTTP-specific
 * - NOT tied to AuthSession or AuthContext
 *
 * Responsibilities:
 * - verify: validate token integrity & temporal validity
 * - sign: produce a signed JWT from claims
 */
export interface JwtFacade<
  C extends Record<string, unknown>,
  V extends string = string,
  S extends string = string
> {
  /**
   * Verifies a JWT and returns its decoded claims.
   *
   * @param token - Raw JWT string
   * @param now - Current timestamp (seconds since epoch)
   * @returns Verified claims or error reason
   */
  verify(
    token: string,
    now: number
  ): Promise<
    Result<
      {
        readonly claims: C;
      },
      V
    >
  >;

  /**
   * Signs claims into a JWT.
   *
   * The facade does NOT enforce:
   * - registered claims (iat, exp, iss, aud)
   * - token lifetime policy
   *
   * These concerns are adapter- or application-specific.
   *
   * @param claims - Claims to sign
   * @returns Signed JWT or error reason
   */
  sign(claims: C): Promise<Result<string, S>>;
}
