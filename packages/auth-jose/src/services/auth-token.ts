import type { AuthSession } from "@comity/auth";
import type { CryptoKey, JWK, JWTPayload, KeyObject } from "jose";
import type { JoseJwtPayload } from "../contracts/jwt-payload.js";
import type { AuthTokenService } from "../contracts/token-service.js";
import type { AuthJoseEventEmitter } from "../events/auth-jose.js";

import { SignJWT, jwtVerify } from "jose";
import { INVALID_JWT_REASONS, InvalidJwtError } from "../errors/invalid-jwt.js";
import { joseErrorToReason } from "../mappers/error-to-reason.js";
import { jwtPayloadToAuthSession } from "../mappers/jwt-to-session.js";
import { authSessionToJwtPayload } from "../mappers/session-to-jwt.js";

/**
 * Options for JoseAuthTokenService.
 */
export interface JoseAuthTokenServiceOptions {
  /** Issuer */
  issuer: string;

  /** Audience */
  audience: string;

  /** Access token key */
  accessKey: CryptoKey | KeyObject | JWK | Uint8Array;

  /** Refresh token key */
  refreshKey: CryptoKey | KeyObject | JWK | Uint8Array;

  /** Algorithm */
  algorithm: string;
}

/**
 * Result of a successful token verification.
 */
export interface VerifiedAuthToken {
  /** Session reconstructed from token */
  session: AuthSession;

  /** Raw JWT payload */
  payload: JoseJwtPayload & JWTPayload;
}

/**
 * JOSE-based authentication token service.
 *
 * @remarks
 * Responsibilities:
 * - Sign access & refresh tokens
 * - Verify and decode JWTs
 * - Emit technical (non-domain) events
 *
 * Does NOT:
 * - Enforce assurance / revocation
 * - Perform HTTP mapping
 * - Throw domain-level auth errors
 */
export class JoseAuthTokenService implements AuthTokenService {
  /**  */
  #options: JoseAuthTokenServiceOptions;

  /**  */
  #events: AuthJoseEventEmitter;

  /**
   * @param options Service options
   * @param events Event emitter
   */
  constructor(options: JoseAuthTokenServiceOptions, events: AuthJoseEventEmitter) {
    this.#options = options;
    this.#events = events;
  }

  /**
   * Signs a new access token.
   *
   * @param session The auth session
   * @returns Signed access token
   */
  async signAccessToken(session: AuthSession): Promise<string> {
    const payload = authSessionToJwtPayload(session);

    return this.sign(payload, this.#options.accessKey);
  }

  /**
   * Signs a refresh token.
   *
   * @param session The auth session
   * @returns Signed refresh token
   */
  async signRefreshToken(session: AuthSession): Promise<string> {
    // Refresh must be enabled
    if (!session.refresh?.enabled) {
      const reason = INVALID_JWT_REASONS.JWT_REFRESH_NOT_ALLOWED;

      this.#events.tokenInvalid({ reason });

      throw new InvalidJwtError({ reason });
    }

    const payload = authSessionToJwtPayload(session);

    return this.sign(payload, this.#options.refreshKey);
  }

  /**
   * Signs a token.
   *
   * @param payload The token payload
   * @param key The key to use for signing
   * @returns Signed token
   * @throws InvalidJwtError
   */
  private sign(
    payload: JWTPayload,
    key: CryptoKey | KeyObject | JWK | Uint8Array
  ): Promise<string> {
    try {
      const jwt = new SignJWT(payload)
        .setProtectedHeader({ alg: this.#options.algorithm })
        .setIssuer(this.#options.issuer)
        .setAudience(this.#options.audience)
        .setIssuedAt(payload.iat);

      // Expiration time
      if (payload.exp !== undefined) {
        jwt.setExpirationTime(payload.exp);
      }

      return jwt.sign(key);
    } catch (cause) {
      const reason = joseErrorToReason(cause, "sign");

      this.#events.tokenInvalid({ reason });

      throw new InvalidJwtError({ reason, cause });
    }
  }

  /**
   * Verifies an access token.
   *
   * @param token The access token
   * @returns Verified auth token
   */
  async verifyAccessToken(token: string): Promise<AuthSession> {
    const { session, payload } = await this.verify(token, this.#options.accessKey);

    // Emit event
    this.#events.tokenVerified({
      sessionId: payload.sid,
      assuranceScore: payload.ass.score,
      issuedAt: payload.iat,
      kind: "access",
      ...(payload.exp ? { expiresAt: payload.exp } : {}),
      ...(payload.scopes ? { scopes: payload.scopes } : {}),
    });

    return session;
  }

  /**
   * Verifies a refresh token.
   *
   * @param token The refresh token
   * @returns Verified auth token
   */
  async verifyRefreshToken(token: string): Promise<AuthSession> {
    const { session, payload } = await this.verify(token, this.#options.refreshKey);

    // Emit event
    // Emit event
    this.#events.tokenVerified({
      sessionId: payload.sid,
      assuranceScore: payload.ass.score,
      issuedAt: payload.iat,
      kind: "refresh",
      ...(payload.exp ? { expiresAt: payload.exp } : {}),
      ...(payload.scopes ? { scopes: payload.scopes } : {}),
    });

    return session;
  }

  /**
   * Verifies a token.
   *
   * @param token The token to verify
   * @param key The key to use for verification
   * @returns Verified auth token
   * @throws InvalidJwtError
   */
  private async verify(
    token: string,
    key: CryptoKey | KeyObject | JWK | Uint8Array
  ): Promise<VerifiedAuthToken> {
    try {
      const { payload } = await jwtVerify<JoseJwtPayload>(token, key, {
        issuer: this.#options.issuer,
        audience: this.#options.audience,
      });

      const session = jwtPayloadToAuthSession(payload);

      return { session, payload };
    } catch (cause) {
      const reason = joseErrorToReason(cause, "verify");

      this.#events.tokenInvalid({ reason });

      throw new InvalidJwtError({ reason, cause });
    }
  }
}
