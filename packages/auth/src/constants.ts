/**
 * Constants used throughout the authentication module.
 *
 * @remarks
 * These constants define default values and limits for authentication operations.
 * They are used to ensure consistency across the codebase and make configuration
 * more maintainable.
 */

/**
 * Default token lifetime in seconds (1 hour).
 */
export const DEFAULT_TOKEN_LIFETIME = 60 * 60;

/**
 * Default maximum refresh window in seconds (7 days).
 *
 * @remarks
 * Tokens can be refreshed if they were issued within this time window.
 * This prevents indefinite token renewal.
 */
export const DEFAULT_MAX_REFRESH_WINDOW = 7 * 24 * 60 * 60;

/**
 * Default minimum refresh window in seconds (15 minutes).
 *
 * @remarks
 * Tokens can only be refreshed if they expire within this time window.
 * This prevents refreshing tokens that are still valid for a long time.
 */
export const DEFAULT_MIN_REFRESH_WINDOW = 15 * 60;

/**
 * Default cookie name for storing authentication tokens.
 */
export const DEFAULT_COOKIE_NAME = "auth-token";

/**
 * Default header name for extracting JWT tokens.
 */
export const DEFAULT_AUTH_HEADER = "authorization";

/**
 * Default header prefix for JWT tokens.
 */
export const DEFAULT_AUTH_HEADER_PREFIX = "Bearer ";

/**
 * Default cookie path.
 */
export const DEFAULT_COOKIE_PATH = "/";

/**
 * Default cookie sameSite attribute.
 */
export const DEFAULT_COOKIE_SAMESITE = "strict" as const;
