/**
 * HTTP cookie representation.
 */
export interface HttpCookie {
  /** Cookie value */
  readonly value: string;

  /** Cookie path */
  readonly path?: string;

  /** Cookie domain */
  readonly domain?: string;

  /** Cookie httpOnly flag */
  readonly httpOnly?: boolean;

  /** Cookie secure flag */
  readonly secure?: boolean;

  /** Cookie same-site policy */
  readonly sameSite?: "strict" | "lax" | "none";

  /** Cookie max age in seconds */
  readonly maxAge?: number;

  /** Cookie expiration date */
  readonly expires?: Date;
}
