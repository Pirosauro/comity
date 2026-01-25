import type { HttpMethod } from "../contracts/method.js";

/**
 * Framework-agnostic HTTP request snapshot.
 *
 * @comity ai-jsdoc-skip
 */
export interface HttpRequest {
  /** Request identifier. */
  readonly id: string;

  /** HTTP method. */
  readonly method: HttpMethod;

  /** Full request URL. */
  readonly url: URL;

  /** Headers (lower-cased keys recommended). */
  readonly headers: Readonly<Record<string, string>>;

  /** Query parameters. */
  readonly query: Readonly<Record<string, string | readonly string[]>>;

  /** Path parameters (from router adapter). */
  readonly params: Readonly<Record<string, string>>;

  /** Remote address (if available). */
  readonly remoteAddress?: string;

  /** Parsed body (if any). */
  readonly body?: unknown;

  /** Raw body (optional, adapter-provided). */
  readonly rawBody?: unknown;
}
