/**
 * HTTP transport contract.
 *
 * Defines the semantics of executing an outbound HTTP request without binding
 * to a concrete transport implementation. Adapters (e.g. `@comity/http-fetch`)
 * implement this contract.
 */
export interface HttpTransport {
  /**
   * Execute an HTTP request.
   *
   * @param input - Request URL or Request object.
   * @param init - Request initialization options.
   *
   * @returns Promise resolving to the HTTP response.
   */
  request(input: Request | URL, init?: RequestInit): Promise<Response>;
}