import type {
  AuthMethod,
  AuthSessionTransport,
  AuthIdentityProof,
} from "./constants.js";

/**
 *
 */
export type { AuthMethod, AuthSessionTransport, AuthIdentityProof };

export type Ok<T> = { ok: true; value: T };
export type Ko<T extends string> = {
  ok: false;
  reason: T;
  meta?: Record<string, unknown>;
};

export type Result<T, E extends string> = Ok<T> | Ko<E>;

export type ResultValue<T> = T extends { ok: true; value: infer V } ? V : never;

export type UserId = string;

export type SessionId = string;

export type AuthUser<U extends Record<string, unknown> = {}> = {
  id: UserId;
} & U;

export interface AuthAssurance {
  /**  */
  methods: AuthMethod[];

  /** Optional external identity attestation */
  proof?: AuthIdentityProof;

  /** */
  score: number;

  /** */
  evaluatedAt: number;

  /** */
  context: {
    /** Optional user agent string */
    userAgent?: string;

    /** Optional IP address */
    ipAddress?: string;

    /** Optional device identifier */
    deviceId?: string;

    /** Optional channel */
    channel?: "web" | "mobile" | "cli" | "api";
  };
}

export interface AuthSession<M extends Record<string, unknown> = {}> {
  /** Session identifier (revocable, DB-backed) */
  id: SessionId;

  /** Session creation time (seconds since epoch) */
  createdAt: number;

  /** Hard expiration (seconds since epoch) */
  expiresAt?: number;

  /** Last time a strong authentication step was completed */
  verifiedAt?: number;

  /** Authentication assurance snapshot */
  assurance: AuthAssurance;

  /** How this session is transported */
  transport: AuthSessionTransport;

  /** Refresh capabilities */
  refresh?: {
    /** Session can be refreshed */
    enabled: boolean;

    /** Hard refresh expiration */
    expiresAt?: number;
  };

  /** Step-up metadata */
  stepUp?: {
    /** Session resulted from a step-up */
    fromSessionId: SessionId;

    /** When step-up was completed */
    at: number;
  };

  /** Optional authorization scopes */
  scopes?: string[];

  /** Adapter-level metadata */
  meta?: M;
}

export interface JWTPayload<
  U extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {}
> {
  /** Subject (sub) - typically the user ID */
  sub: string;

  /** Issued at (iat) - seconds since epoch when token was issued */
  iat: number;

  /** Expiration time (exp) - seconds since epoch when token expires */
  exp?: number;

  /** Issuer (iss) - token issuer */
  iss?: string;

  /** Audience (aud) - intended token audience */
  aud?: string | string[];

  /** User information extracted from JWT */
  usr: AuthUser<U>;

  /** User session information extracted from JWT */
  ses: AuthSession<S>;

  /** Additional custom claims */
  [key: string]: unknown;
}
