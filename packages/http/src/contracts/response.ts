/** HTTP response. */
export interface HttpResponse {
  /** HTTP status code. */
  status: number;

  /** HTTP headers. */
  headers?: Record<string, string>;

  /** HTTP body. */
  body?: unknown;
}
