import type { Context } from "hono";

/**
 * User context that gets set in Hono context after successful authentication.
 */
export type AuthUser<T = {}> = { id: string } & T;

/**
 * Basic JWT payload structure with standard claims.
 */
export type JWTPayload = {
  /**
   * Subject (sub) - typically the user ID.
   */
  sub?: string;

  /**
   * Issued at (iat) - timestamp when token was issued.
   */
  iat?: number;

  /**
   * Expiration time (exp) - timestamp when token expires.
   */
  exp?: number;

  /**
   * Issuer (iss) - token issuer.
   */
  iss?: string;

  /**
   * Audience (aud) - intended token audience.
   */
  aud?: string | string[];

  /**
   * Two-factor authentication verified timestamp.
   */
  verified?: number;

  /**
   * User information extracted from JWT.
   */
  user: AuthUser;
};

/**
 * Hono context extension for authentication module.
 */
export interface AuthModuleHonoContext {
  Variables: {
    /**
     * Authenticated user information extracted from JWT.
     */
    user?: AuthUser;
  };
}

/**
 * Basic authentication module options.
 */
export interface AuthModuleOptions {
  /**
   * JWT secret for signing and verification.
   */
  secret: string;

  /**
   * Token lifetime in seconds. Defaults to 3600 (1 hour).
   */
  lifetime?: number;

  /**
   * JWT issuer claim (iss).
   */
  issuer?: string;

  /**
   * JWT audience claim (aud).
   */
  audience?: string;

  /**
   * JWT signing algorithm.
   */
  algorithm?: "HS256" | "HS384" | "HS512" | "RS256" | "RS384" | "RS512";

  /**
   * Maximum window (in seconds) for refreshing tokens.
   * Defaults to 604800 (7 days).
   */
  maxRefreshWindow?: number;

  /**
   * Minimum window (in seconds) for refreshing tokens.
   * Defaults to 900 (15 minutes).
   */
  minRefreshWindow?: number;

  /**
   * Two-factor authentication configuration.
   */
  twoFactor?: {
    /**
     * How long 2FA verification is valid (in seconds).
     * Defaults to 1800 (30 minutes).
     */
    validityDuration?: number;

    /**
     * Roles that require 2FA verification.
     * If empty, no 2FA enforcement occurs.
     */
    requiredForRoles?: string[];
  };

  /**
   * Cookie configuration for storing JWT tokens.
   */
  cookie?: {
    /**
     * Cookie name. Defaults to 'auth-token'.
     */
    name?: string;

    /**
     * Cookie domain.
     */
    domain?: string;

    /**
     * Cookie path. Defaults to '/'.
     */
    path?: string;

    /**
     * Cookie httpOnly flag. Defaults to true.
     */
    httpOnly?: boolean;

    /**
     * Cookie secure flag. Defaults to true in production.
     */
    secure?: boolean;

    /**
     * Cookie sameSite attribute. Defaults to 'strict'.
     */
    sameSite?: "strict" | "lax" | "none";

    /**
     * Cookie max age in seconds.
     */
    maxAge?: number;
  };

  /**
   * Header configuration for extracting JWT tokens.
   */
  header?: {
    /**
     * Header name to extract JWT from. Defaults to
     * 'Authorization'.
     */
    name?: string;

    /**
     * Header prefix to strip when extracting the token.
     * Defaults to 'Bearer '.
     */
    prefix?: string;
  };
}

/**
 * Auth service interface that external modules can use.
 *
 * This is injected into external modules during their setup,
 * so they don't need to know about AuthModuleOptions.
 */
export type AuthService = {
  /**
   * Complete login process for a validated user.
   * Sets JWT token in cookies and context.
   */
  login<E extends AuthModuleHonoContext = AuthModuleHonoContext>(
    user: AuthUser<any>,
    c: Context<E>
  ): Promise<string>;

  /**
   * Complete logout process.
   * Clears authentication cookies and context.
   */
  logout<E extends AuthModuleHonoContext = AuthModuleHonoContext>(
    c: Context<E>
  ): Promise<void>;

  /**
   * Refresh a JWT token for a user.
   * Creates a new token with updated timestamp.
   */
  refreshToken<E extends AuthModuleHonoContext = AuthModuleHonoContext>(
    c: Context<E>
  ): Promise<string>;

  /**
   * Sign a JWT token for a user.
   * Returns just the token without setting cookies.
   */
  signToken(user: AuthUser): Promise<string>;
};

/**
 * Hooks triggered by the auth module.
 *
 * These hooks allow other modules to react to authentication-related actions and data.
 */
export type AuthModuleHooks<T = {}> = {
  /**
   * Emitted when the auth module is fully initialized and ready.
   * Provides the AuthService for other modules to use.
   */
  "@comity/auth:initialized": AuthService;

  /**
   * Triggered when a user is set in the context after successful authentication.
   * Provides the authenticated user object.
   */
  "@comity/auth:user": AuthUser<T>;
};

/**
 * Events emitted by the auth module.
 *
 * These events allow other modules to react to authentication-related
 * actions and access the auth service.
 */
export type AuthModuleEvents<T = {}> = {
  /**
   * Emitted when a JWT token is successfully verified in middleware.
   * Provides the decoded JWT payload.
   */
  "@comity/auth:token-verified": JWTPayload;

  /**
   * Emitted when a JWT token has expired.
   * Useful for cleanup, notifications, and session management.
   */
  "@comity/auth:token-expired": {
    user: AuthUser<T>;
    expiredAt: number;
    token: string;
  };

  /**
   * Emitted when authentication fails (invalid/expired token, missing auth).
   * Useful for security monitoring, rate limiting, and audit logging.
   */
  "@comity/auth:authentication-failed": {
    reason: "invalid-token" | "expired" | "missing" | "malformed";
    context: "middleware" | "login";
    userId?: string;
    ip?: string;
    userAgent?: string;
  };

  /**
   * Emitted when a token is refreshed/renewed.
   * Useful for session management and audit trails.
   */
  "@comity/auth:token-refreshed": {
    outdated: string;
    current: string;
    timestamp: number;
  };

  /**
   * Emitted when a user successfully logs in.
   * Provides the authenticated user and JWT token.
   */
  "@comity/auth:user-logged-in": {
    user: AuthUser<T>;
    token: string;
  };

  /**
   * Emitted when a user logs out.
   * Provides the user who logged out.
   */
  "@comity/auth:user-logged-out": {
    user?: AuthUser<T>;
  };
};

/**
 * Context with custom properties.
 *
 * This utility type allows you to extend the CoreContextInterface
 * with your own custom properties, ensuring full type safety.
 *
 * @example
 * ```typescript
 * type MyAuth = { auth: { login: () => void } };
 * type MyContext = ContextWithCustom<MyAuth>;
 *
 * function useAuth(ctx: MyContext) {
 *   ctx.auth.login(); // fully typed!
 * }
 * ```
 */
export type AuthModuleContext = {
  auth: AuthService;
};
