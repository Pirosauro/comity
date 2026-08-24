import type { AuthSession, AuthTokenService } from "@comity/auth";
import type { Result } from "@comity/primitives/result";
import type { CryptoKey, JWK, JWTPayload, KeyObject } from "jose";
import type { AuthJoseEventObserver } from "./observers/observer.js";
import type { JoseAuthTokenServiceOptions, JoseJwtPayload } from "./types.js";

import { AuthError } from "@comity/auth/errors";
import { toSafePayload } from "@comity/primitives/errors";
import { isFailure } from "@comity/primitives/result";
import { SignJWT, jwtVerify } from "jose";
import { joseErrorToAuthError } from "./internal/jose-error-to-auth-error.js";
import { jwtPayloadToAuthSession } from "./internal/jwt-to-session.js";
import { authSessionToJwtPayload } from "./internal/session-to-jwt.js";

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
  #observer: AuthJoseEventObserver;

  /**
   * @param options - Service options
   * @param observer - Event observer for token verification/signing events
   */
  constructor(options: JoseAuthTokenServiceOptions, observer: AuthJoseEventObserver) {
    this.#options = options;
    this.#observer = observer;
  }

  /**
   * Signs a new access token.
   *
   * @param session The auth session
   *
   * @returns Signed access token
   */
  async signAccessToken(session: AuthSession): Promise<Result<string, AuthError, "ok">> {
    const payload = authSessionToJwtPayload(session);

    return this.sign(payload, this.#options.accessKey, "access");
  }

  /**
   * Signs a refresh token.
   *
   * @param session The auth session
   *
   * @returns Signed refresh token
   */
  async signRefreshToken(session: AuthSession): Promise<Result<string, AuthError, "ok">> {
    // Refresh must be enabled
    if (!session.refresh?.enabled) {
      const reason = "refresh_not_allowed";
      const error = new AuthError(reason, {
        details: { policy: "jwt", subject: session.id.toString() },
        context: { adapter: "jose" },
      });

      this.#observer.onTokenInvalid({ kind: "refresh", reason, error: toSafePayload(error) });

      return { ok: false, error };
    }

    const payload = authSessionToJwtPayload(session);

    return this.sign(payload, this.#options.refreshKey, "refresh");
  }

  /**
   * Signs a token.
   *
   * @param payload - The token payload
   * @param key - The key to use for signing
   * @param kind - The kind of token being signed ("access" or "refresh")
   *
   * @returns Signed token
   */
  private async sign(
    payload: JWTPayload,
    key: CryptoKey | KeyObject | JWK | Uint8Array,
    kind: "access" | "refresh"
  ): Promise<Result<string, AuthError, "ok">> {
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

      return { ok: true, value: await jwt.sign(key) };
    } catch (cause) {
      const error = joseErrorToAuthError(cause, "sign", payload.sub);

      // Emit event
      this.#observer.onTokenInvalid({
        kind,
        reason: error.meta.reason,
        error: toSafePayload(error),
      });

      return { ok: false, error };
    }
  }

  /**
   * Verifies an access token.
   *
   * @param token The access token
   *
   * @returns Verified auth token
   */
  async verifyAccessToken(token: string): Promise<Result<AuthSession, AuthError, "ok">> {
    return this.verify(token, this.#options.accessKey, "access");
  }

  /**
   * Verifies a refresh token.
   *
   * @param token The refresh token
   *
   * @returns Verified auth token
   */
  async verifyRefreshToken(token: string): Promise<Result<AuthSession, AuthError, "ok">> {
    return this.verify(token, this.#options.refreshKey, "refresh");
  }

  /**
   * Verifies a token.
   *
   * @param token - The token to verify
   * @param key - The key to use for verification
   * @param kind - The kind of token being verified ("access" or "refresh")
   *
   * @returns Verified auth token
   */
  private async verify(
    token: string,
    key: CryptoKey | KeyObject | JWK | Uint8Array,
    kind: "access" | "refresh"
  ): Promise<Result<AuthSession, AuthError, "ok">> {
    let payload: JoseJwtPayload;

    try {
      ({ payload } = await jwtVerify<JoseJwtPayload>(token, key, {
        issuer: this.#options.issuer,
        audience: this.#options.audience,
      }));
    } catch (cause) {
      const error = joseErrorToAuthError(cause, "verify");

      this.#observer.onTokenInvalid({
        kind,
        reason: error.meta.reason,
        error: toSafePayload(error),
      });

      return { ok: false, error };
    }

    const sessionResult = jwtPayloadToAuthSession(payload);

    if (isFailure(sessionResult)) {
      const error = sessionResult.error;

      this.#observer.onTokenInvalid({
        kind,
        reason: error.meta.reason,
        error: toSafePayload(error),
      });

      return { ok: false, error };
    }

    const session = sessionResult.value;

    // Emit event
    this.#observer.onTokenVerified({
      kind,
      sessionId: session.id,
      assuranceScore: session.assurance.score,
      issuedAt: session.createdAt,
      ...(session.expiresAt ? { expiresAt: session.expiresAt } : {}),
      ...(session.scopes ? { scopes: session.scopes } : {}),
    });

    return { ok: true, value: session };
  }
}
