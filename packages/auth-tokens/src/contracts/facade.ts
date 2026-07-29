import type {
    AuthSession,
    AuthSessionAssuranceInput,
    AuthSessionId,
    AuthSessionTransport,
} from "@comity/auth";
import type { AuthError } from "@comity/auth/errors";
import type { Result } from "@comity/primitives/result";
import type { AuthTokenEnvelope } from "./envelope.js";

/**
 * Input data required to issue new tokens, including session creation parameters and optional refresh capabilities.
 */
export interface IssueTokensInput extends AuthSessionAssuranceInput {
  /** Session identifier */
  readonly id: AuthSessionId;

  /** Hard expiration */
  readonly expiresAt?: number;

  /** Session transport mechanism */
  readonly transport: AuthSessionTransport;

  /** Refresh capabilities */
  readonly refresh?: false | number; // false = disabled, number = expiresAt

  /** Step-up parent */
  readonly parent?: AuthSessionId;

  /** Authorization scopes */
  readonly scopes?: readonly string[];
}

/**
 * AuthTokenFacade provides a simplified interface for authentication operations, abstracting away the underlying complexities of token management and session handling.
 */
export interface AuthTokenFacade {
  /**
   * Authenticates a request by verifying the access token and
   * asserting that the underlying session is still valid.
   * (Verify Token -> Get Session -> Assert Session)
   *
   * @param token - The access token to authenticate
   * @param now - Current timestamp for session validation
   *
   * @returns The result of the authentication, containing either the auth session or an auth error
   */
  authenticate(token: string, now: number): Promise<Result<AuthSession, AuthError, "ok">>;

  /**
   * Issues a new set of tokens for a given session creation input.
   * (Create Session -> Sign Access Token -> Sign Refresh Token)
   *
   * @param input - The input data required to create a new session
   * @param now - Current timestamp for session creation
   *
   * @returns The result of the token issuance, containing either the token envelope or an auth error
   */
  issueTokens(
    input: IssueTokensInput,
    now: number
  ): Promise<Result<AuthTokenEnvelope, AuthError, "ok">>;

  /**
   * Refreshes an existing session using a refresh token.
   * (Verify Refresh Token -> Refresh Session -> Sign New Tokens)
   *
   * @param token - The refresh token to use for refreshing the session
   * @param id - The new session ID to assign to the refreshed session
   * @param now - Current timestamp for session refresh
   *
   * @returns The result of the token refresh, containing either the new token envelope or an auth error
   */
  refreshTokens(
    token: string,
    id: AuthSessionId,
    now: number
  ): Promise<Result<AuthTokenEnvelope, AuthError, "ok">>;
}
