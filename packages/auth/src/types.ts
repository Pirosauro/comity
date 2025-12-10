import type { Context } from "hono";

/**
 * User context that gets set in Hono context after successful authentication.
 *
 * @remarks
 * Represents the authenticated user information that is made available
 * throughout the request lifecycle. The generic type parameter allows
 * for extending the user object with additional properties.
 *
 * @template T - Additional user properties beyond the required id field
 *
 * @example
 * ```typescript
 * // Basic user
 * const user: AuthUser = { id: "user-123" };
 *
 * // Extended user with roles and profile data
 * const extendedUser: AuthUser<{ roles: string[]; email: string }> = {
 *   id: "user-123",
 *   roles: ["admin"],
 *   email: "user@example.com"
 * };
 * ```
 */
export type AuthUser<T = {}> = { id: string } & T;

/**
 * JWT payload structure used for token generation and validation.
 *
 * @remarks
 * Contains standard JWT claims and optional custom data. The payload
 * is signed and verified using the configured secret. The 'sub' field
 * typically contains the user ID, and the 'user' field contains the
 * full user object for convenience.
 *
 * @example
 * ```typescript
 * const payload: JWTPayload = {
 *   sub: "user-123",
 *   user: { id: "user-123", email: "user@example.com" },
 *   iat: 1640995200,
 *   exp: 1641081600,
 *   iss: "comity-auth"
 * };
 * ```
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
 * Configuration options for the authentication module.
 *
 * @remarks
 * Defines all configurable aspects of the authentication system including
 * JWT settings, cookie configuration, header extraction, and two-factor
 * authentication. All options are optional except for the secret.
 *
 * @example
 * ```typescript
 * const authOptions: AuthModuleOptions = {
 *   secret: "your-jwt-secret",
 *   lifetime: 3600, // 1 hour
 *   issuer: "my-app",
 *   cookie: {
 *     name: "auth-token",
 *     secure: true,
 *     sameSite: "strict"
 *   },
 *   twoFactor: {
 *     validityDuration: 1800, // 30 minutes
 *     requiredForRoles: ["admin"]
 *   }
 * };
 * ```
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
    sameSite?: "strict";

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
 * @remarks
 * This interface is injected into external modules during their setup,
 * providing a clean API for authentication operations without exposing
 * internal configuration details. All methods are async and work with
 * Hono contexts.
 *
 * @template E - Hono context type that extends AuthModuleHonoContext
 *
 * @example
 * ```typescript
 * // In an external module
 * export function setup(authService: AuthService) {
 *   // Use authService.login(), authService.logout(), etc.
 * }
 * ```
 */
export type AuthService = {
  /**
   * Complete login process for a validated user.
   *
   * @remarks
   * Sets JWT token in cookies and context. This is the primary method
   * for establishing user sessions after successful authentication.
   *
   * @param user - The authenticated user object
   * @param c - Hono context
   * @returns Promise resolving to the JWT token string
   *
   * @example
   * ```typescript
   * const token = await authService.login(
   *   { id: "user-123", email: "user@example.com" },
   *   c
   * );
   * ```
   */
  login<E extends AuthModuleHonoContext = AuthModuleHonoContext>(
    user: AuthUser<any>,
    c: Context<E>
  ): Promise<string>;

  /**
   * Complete logout process.
   *
   * @remarks
   * Clears authentication cookies and context. This should be called
   * when users explicitly log out or when sessions need to be terminated.
   *
   * @param c - Hono context
   *
   * @example
   * ```typescript
   * await authService.logout(c);
   * ```
   */
  logout<E extends AuthModuleHonoContext = AuthModuleHonoContext>(
    c: Context<E>
  ): Promise<void>;

  /**
   * Refresh a JWT token for a user.
   *
   * @remarks
   * Creates a new token with updated timestamp while preserving user data.
   * This is typically used for extending user sessions without re-authentication.
   *
   * @param c - Hono context
   * @returns Promise resolving to the new JWT token string
   *
   * @example
   * ```typescript
   * const newToken = await authService.refreshToken(c);
   * ```
   */
  refreshToken<E extends AuthModuleHonoContext = AuthModuleHonoContext>(
    c: Context<E>
  ): Promise<string>;

  /**
   * Sign a JWT token for a user.
   *
   * @remarks
   * Returns just the token without setting cookies or context.
   * Useful for API-to-API authentication or when you only need the token.
   *
   * @param user - The user object to encode in the token
   * @returns Promise resolving to the JWT token string
   *
   * @example
   * ```typescript
   * const token = await authService.signToken({ id: "user-123" });
   * ```
   */
  signToken(user: AuthUser): Promise<string>;
};

/**
 * Hooks triggered by the auth module.
 *
 * @remarks
 * These hooks allow other modules to react to authentication-related actions and data.
 * Hooks are emitted through the event system and can be listened to by other modules
 * to perform side effects or additional processing.
 *
 * @template T - Additional user properties beyond the required id field
 *
 * @example
 * ```typescript
 * // Listen for auth initialization
 * hooks.on("@comity/auth:initialized", (authService) => {
 *   // Store auth service reference for later use
 * });
 *
 * // Listen for authenticated users
 * hooks.on("@comity/auth:user", (user) => {
 *   console.log("User authenticated:", user.id);
 * });
 * ```
 */
export type AuthModuleHooks<T = {}> = {
  /**
   * Emitted when the auth module is fully initialized and ready.
   *
   * @remarks
   * This hook provides the AuthService instance that other modules can use
   * for authentication operations. It's emitted once during module setup.
   */
  "@comity/auth:initialized": AuthService;

  /**
   * Triggered when a user is set in the context after successful authentication.
   *
   * @remarks
   * This hook is emitted whenever a user is successfully authenticated and
   * their information is set in the Hono context. Useful for logging, analytics,
   * or triggering user-specific setup.
   */
  "@comity/auth:user": AuthUser<T>;
};

/**
 * Events emitted by the auth module.
 *
 * @remarks
 * These events allow other modules to react to authentication-related
 * actions and access the auth service. Events are emitted through the
 * event system and can be listened to by other modules for monitoring,
 * logging, or additional processing.
 *
 * @template T - Additional user properties beyond the required id field
 *
 * @example
 * ```typescript
 * // Monitor authentication failures
 * events.on("@comity/auth:authentication-failed", (data) => {
 *   console.log("Auth failed:", data.reason, "from", data.context);
 * });
 *
 * // Track user logins
 * events.on("@comity/auth:user-logged-in", (data) => {
 *   analytics.track("user_login", { userId: data.user.id });
 * });
 * ```
 */
export type AuthModuleEvents<T = {}> = {
  /**
   * Emitted when a JWT token is successfully verified in middleware.
   *
   * @remarks
   * This event is fired whenever a JWT token passes verification in the
   * authentication middleware. Useful for audit logging and monitoring.
   */
  "@comity/auth:token-verified": JWTPayload;

  /**
   * Emitted when a JWT token has expired.
   *
   * @remarks
   * Fired when an expired token is encountered. Useful for cleanup,
   * notifications, and session management decisions.
   */
  "@comity/auth:token-expired": {
    user: AuthUser<T>;
    expiredAt: number;
    token: string;
  };

  /**
   * Emitted when authentication fails.
   *
   * @remarks
   * Fired when authentication fails for any reason. Useful for security
   * monitoring, rate limiting, and audit logging.
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
   *
   * @remarks
   * Fired when a token is successfully refreshed. Useful for session
   * management and audit trails.
   */
  "@comity/auth:token-refreshed": {
    outdated: string;
    current: string;
    timestamp: number;
  };

  /**
   * Emitted when a user successfully logs in.
   *
   * @remarks
   * Fired after successful login completion. Useful for analytics,
   * welcome messages, and user activity tracking.
   */
  "@comity/auth:user-logged-in": {
    user: AuthUser<T>;
    token: string;
  };

  /**
   * Emitted when a user logs out.
   *
   * @remarks
   * Fired when a user logs out, either explicitly or through session
   * expiration. Useful for cleanup and activity tracking.
   */
  "@comity/auth:user-logged-out": {
    user?: AuthUser<T>;
  };
};

/**
 * Context with custom properties.
 *
 * @remarks
 * This utility type allows you to extend the CoreContextInterface
 * with your own custom properties, ensuring full type safety.
 * The auth module adds an 'auth' property containing the AuthService.
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
