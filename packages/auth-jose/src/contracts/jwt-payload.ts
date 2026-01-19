import type { AuthSessionAssurance } from "@comity/auth";

/**
 * JWT payload used by @comity/auth-jose.
 *
 * This is NOT a domain model.
 */
export interface JoseJwtPayload extends Record<string, unknown> {
  /** Session id */
  sid: string;

  /** Issued at in seconds */
  iat: number;

  /** Expiration in seconds */
  exp?: number;

  /** Last strong verification time in seconds */
  vat?: number;

  /** Assurance snapshot */
  ass: AuthSessionAssurance;

  /** Scopes */
  scopes?: string[];

  /** Refresh enabled */
  refresh?: {
    /** Enabled */
    enabled: boolean;

    /** Expiration in seconds */
    exp?: number;
  };

  /** Step-up info */
  stepUp?: {
    /** Parent session identifier */
    parent: string;

    /** Step-up time in seconds */
    at: number;
  };
}
