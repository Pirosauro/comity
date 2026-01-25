/**
 * Represents an HTTP response.
 *
 * @comity ai-jsdoc-skip
 */
export interface HttpResponse {
  /** HTTP status code. */
  status: number;

  /** HTTP headers. */
  headers?: Record<string, string>;

  /** HTTP body. */
  body?: unknown;
}
