import type { AuthFacade, AuthSession, AuthSessionId, AuthTokenService } from "@comity/auth";
import type { Result } from "@comity/primitives/result";
import type { AuthTokenEnvelope } from "../contracts/envelope";
import type { AuthTokenFacade, IssueTokensInput } from "../contracts/facade";

import { AuthError } from "@comity/auth/errors";

/**
 * Default implementation of the AuthTokenFacade.
 */
export class DefaultAuthTokenFacade implements AuthTokenFacade {
  /**  */
  #auth: AuthFacade;

  /**  */
  #tokens: AuthTokenService;

  /**
   * @param auth - The authentication facade to use for session management
   * @param tokens - The token service to use for token operations
   */
  constructor(auth: AuthFacade, tokens: AuthTokenService) {
    this.#auth = auth;
    this.#tokens = tokens;
  }

  /**
   * @inheritdoc
   */
  async authenticate(token: string, now: number): Promise<Result<AuthSession, AuthError, "ok">> {
    const result = await this.#tokens.verifyAccessToken(token);

    if (!result.ok) {
      return result;
    }

    try {
      this.#auth.assertSession(result.value, now);
    } catch (error) {
      if (error instanceof AuthError) {
        return {
          ok: false,
          error,
        };
      }

      return {
        ok: false,
        error: new AuthError("internal_error", {
          details: {
            policy: "authentication",
            subject: result.value.id,
          },
          cause: error instanceof Error ? error : undefined,
        }),
      };
    }

    return result;
  }

  /**
   * @inheritdoc
   */
  async issueTokens(
    input: IssueTokensInput,
    now: number
  ): Promise<Result<AuthTokenEnvelope, AuthError, "ok">> {
    // 1. Create session
    const session = await this.#auth.createSession(input, now);

    if (!session.ok) {
      return session;
    }

    // 2. Sign tokens
    const accessToken = await this.#tokens.signAccessToken(session.value);

    if (!accessToken.ok) {
      return accessToken;
    }

    // 3. Sign refresh token
    const refreshToken = await this.#tokens.signRefreshToken(session.value);

    if (!refreshToken.ok) {
      return refreshToken;
    }

    return {
      ok: true,
      value: {
        session: session.value,
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
      },
    };
  }

  /**
   * @inheritdoc
   */
  async refreshTokens(
    token: string,
    id: AuthSessionId,
    now: number
  ): Promise<Result<AuthTokenEnvelope, AuthError, "ok">> {
    // 1. Verify refresh token
    const verified = await this.#tokens.verifyRefreshToken(token);

    if (!verified.ok) {
      return verified;
    }

    // 2. Refresh session
    const session = await this.#auth.refreshSession(
      {
        id,
        originalId: verified.value.id,
      },
      now
    );

    if (!session.ok) {
      return session;
    }

    // 3. Sign new tokens
    const accessToken = await this.#tokens.signAccessToken(session.value);

    if (!accessToken.ok) {
      return accessToken;
    }

    // 4. Sign new refresh token
    const refreshToken = await this.#tokens.signRefreshToken(session.value);

    if (!refreshToken.ok) {
      return refreshToken;
    }

    return {
      ok: true,
      value: {
        session: session.value,
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
      },
    };
  }
}
