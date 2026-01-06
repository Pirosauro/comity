import type { Result } from "../../core/types.js";
import type { AuthContextResolver } from "../../ports/context-resolver.js";
import type { AuthCredential } from "../../ports/credential.js";
import type { AuthContext } from "../../ports/context.js";
import type { JwtFacade } from "./facade.js";
import type { JwtSessionMapper } from "./session-mapper.js";

export const AUTH_JWT_CONTEXT_RESOLVER_REASONS = {
  /** Credential is missing or malformed */
  INVALID_CREDENTIALS: "auth:jwt_invalid_credential",

  /** Token is malformed or invalid */
  TOKEN_INVALID: "auth:jwt_token_invalid",

  /** Token has expired */
  TOKEN_EXPIRED: "auth:jwt_token_expired",

  /** Token signature is invalid */
  SESSION_INVALID: "auth:jwt_session_invalid",

  /** Token issuer is invalid */
  INVALID_ISSUER: "auth:jwt_invalid_issuer",

  /** Token audience is invalid */
  INVALID_AUDIENCE: "auth:jwt_invalid_audience",

  /** Required claims are missing */
  MISSING_CLAIMS: "auth:jwt_missing_claims",

  /** Token is not yet active */
  TOKEN_NOT_ACTIVE: "auth:jwt_token_not_active", // nbf claim
} as const;

export type AuthJwtContextResolverReason =
  (typeof AUTH_JWT_CONTEXT_RESOLVER_REASONS)[keyof typeof AUTH_JWT_CONTEXT_RESOLVER_REASONS];

export interface JwtAuthContextResolverOptions<
  C extends Record<string, unknown>,
  S extends Record<string, unknown>,
  I extends Record<string, unknown>,
  V extends string,
  R extends string = string
> {
  /** JWT facade */
  jwt: JwtFacade<C, V>;

  /** Maps JWT claims into an AuthSession */
  mapSession: JwtSessionMapper<C, S, R>;

  /** Optional mapper from JWT claims to identity information */
  mapIdentity?: (claims: C) => Result<I, R>;
}

export function createJwtAuthContextResolver<
  C extends Record<string, unknown>,
  S extends Record<string, unknown> = {},
  I extends Record<string, unknown> = {},
  V extends string = string,
  R extends string = string
>(
  options: JwtAuthContextResolverOptions<C, S, I, V, R>
): AuthContextResolver<I, S, V | R | AuthJwtContextResolverReason> {
  return {
    async resolve(
      credential: AuthCredential,
      now: number
    ): Promise<
      Result<AuthContext<S, I>, V | R | AuthJwtContextResolverReason>
    > {
      if (!credential?.value) {
        return {
          ok: false,
          reason: AUTH_JWT_CONTEXT_RESOLVER_REASONS.INVALID_CREDENTIALS,
        };
      }

      const verified = await options.jwt.verify(credential.value, now);

      // Propagate verification errors
      if (!verified.ok) return verified;

      const session = options.mapSession(verified.value.claims);

      // Propagate session mapping errors
      if (!session.ok) return session;

      if (options.mapIdentity) {
        const identity = options.mapIdentity(verified.value.claims);

        // Propagate identity mapping errors
        if (!identity.ok) return identity;

        return {
          ok: true,
          value: {
            session: session.value,
            identity: identity.value,
          },
        };
      }

      return {
        ok: true,
        value: {
          session: session.value,
        },
      };
    },
  };
}
