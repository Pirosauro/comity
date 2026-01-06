import type {
  CryptoKey,
  KeyObject,
  JWK,
  JWTHeaderParameters,
  JWTPayload,
  JWTVerifyOptions,
  SignOptions,
} from "jose";
import type { Result } from "../../core/types.js";
import type { JwtFacade } from "../jwt/facade.js";

import { jwtVerify, SignJWT } from "jose";
import { AUTH_JWT_CONTEXT_RESOLVER_REASONS } from "../jwt/context-resolver.js";

const AUTH_JOSE_JWT_REASONS = {
  ...AUTH_JWT_CONTEXT_RESOLVER_REASONS,

  /** Algorithm mismatch */
  ALGORITHM_MISMATCH: "auth:jose_algorithm_mismatch",

  /** Key mismatch */
  KEY_MISMATCH: "auth:jose_key_mismatch",

  /** Invalid JSON Web Key */
  JWK_INVALID: "auth:jose_jwk_invalid",
} as const;

export type AuthJoseJwtReason =
  (typeof AUTH_JOSE_JWT_REASONS)[keyof typeof AUTH_JOSE_JWT_REASONS];

export interface JoseJwtFacadeOptions {
  /** Shared configuration */
  algorithm: string;

  /** Verification specific */
  verify: {
    /** Key can be symmetric or asymmetric depending on algorithm */
    key: CryptoKey | KeyObject | JWK | Uint8Array;

    /** Verification options */
    options?: JWTVerifyOptions;
  };

  /** Signing specific */
  sign: {
    /** Key can be symmetric or asymmetric depending on algorithm */
    key: CryptoKey | KeyObject | JWK | Uint8Array;

    /** Signing options */
    options?: SignOptions;

    /** Optional JOSE header parameters */
    header?: Omit<JWTHeaderParameters, "alg">;
  };
}

/**
 * JOSE-based JWT facade implementation.
 *
 * Invariants:
 * - verify() returns claims only if token is cryptographically valid and not expired
 * - sign() produces cryptographically secure JWTs
 * - All timestamps use seconds since epoch
 *
 * Misuse Prevention:
 * - Do not use without proper key management
 * - Always validate claims after verification
 * - Handle verification failures gracefully
 */
export class JoseJwtFacade<C extends Record<string, unknown> = JWTPayload>
  implements JwtFacade<C, AuthJoseJwtReason, AuthJoseJwtReason>
{
  constructor(private readonly options: JoseJwtFacadeOptions) {}

  /**
   * Verifies a JWT using JOSE.
   *
   * Invariants:
   * - Returns claims only if signature is valid and token is not expired
   * - Throws no exceptions (all errors are Result types)
   * - Validates exp claim if present
   */
  async verify(
    token: string,
    now: number
  ): Promise<Result<{ readonly claims: C }, AuthJoseJwtReason>> {
    try {
      const { payload } = await jwtVerify(
        token,
        this.options.verify.key,
        this.options.verify.options
      );

      // Manual expiration check with provided timestamp
      if (payload.exp !== undefined && payload.exp <= now) {
        return {
          ok: false,
          reason: AUTH_JOSE_JWT_REASONS.TOKEN_EXPIRED,
        };
      }

      return {
        ok: true,
        value: {
          claims: payload as C,
        },
      };
    } catch (error) {
      // Map JOSE errors to our error types
      if (error instanceof Error) {
        if (error.message.includes("expired")) {
          return {
            ok: false,
            reason: AUTH_JOSE_JWT_REASONS.TOKEN_EXPIRED,
            meta: {
              adapter: "jose",
              message: error.message,
            },
          };
        }
        if (error.message.includes("signature")) {
          return {
            ok: false,
            reason: AUTH_JOSE_JWT_REASONS.INVALID_SIGNATURE,
          };
        }
      }

      return {
        ok: false,
        reason: AUTH_JOSE_JWT_REASONS.INVALID_TOKEN,
      };
    }
  }

  /**
   * Signs claims into a JWT using JOSE.
   *
   * Invariants:
   * - Produces cryptographically secure tokens
   * - Does not modify input claims
   * - Uses configured algorithm and key
   *
   * Misuse Prevention:
   * - Do not include sensitive data in claims
   * - Always set exp claim for security
   */
  async sign(claims: C): Promise<Result<string, AuthJoseJwtReason>> {
    try {
      const jwt = new SignJWT(claims).setProtectedHeader({
        ...this.options.sign.header,
        alg: this.options.algorithm,
      });

      const token = await jwt.sign(
        this.options.sign.key,
        this.options.sign.options
      );

      return {
        ok: true,
        value: token,
      };
    } catch (error) {
      return {
        ok: false,
        reason: AUTH_JOSE_JWT_REASONS.SIGNING_FAILED,
      };
    }
  }
}
