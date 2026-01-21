/**
 * Session transport mechanism.
 *
 * Represents the transport mechanism used to carry a session between client and system.
 */
export interface AuthSessionTransport {
  /** Transport type identifier, e.g. "bearer", "cookie", "header", "internal" */
  readonly type: string;

  /** Whether the transport is considered secure (true when transport requires confidentiality) */
  readonly secure?: boolean;

  /** Adapter-specific metadata, e.g. cookieName, headerName, sameSite */
  readonly meta?: Readonly<Record<string, unknown>>;
}
