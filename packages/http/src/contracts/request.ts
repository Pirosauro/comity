import type { HttpMethod } from "../contracts/method.js";

/**
 * Framework-agnostic HTTP request snapshot.
 */
export interface HttpRequest {
  /** Request identifier. */
  readonly id: string;

  /** HTTP method. */
  readonly method: HttpMethod;

  /** Full request URL (source of truth for path + query) */
  readonly url: URL;

  /** Headers (lowercase adapter side) */
  readonly headers: Readonly<Record<string, string>>;

  /** Router parameters */
  readonly params: Readonly<Record<string, string>>;

  /** Cookies */
  readonly cookies: Readonly<Record<string, string>>;

  /** Remote address */
  readonly remoteAddress?: string;

  /** Raw body from adapter */
  readonly rawBody?: ReadableStream<Uint8Array> | null;

  // /** Parsed body (lazy / middleware provided) */
  // readonly body?: unknown; // parsed JSON / form / etc
}
