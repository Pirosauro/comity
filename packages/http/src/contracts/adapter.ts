import type { HttpResponse } from "./response.js";

/**
 * HTTP Adapter contract
 *
 * @remarks
 * An HttpAdapter is responsible for translating a HttpResponse
 * into a concrete runtime response (Fetch, Node, Edge, etc).
 *
 * Adapters MAY throw runtime errors.
 */
export interface HttpAdapter {
  /**
   * Sends an HTTP response
   *
   * @param response The HTTP response to send
   * @param options Adapter-specific options
   * @returns A promise that resolves when the response is sent
   */
  send(response: HttpResponse, options: unknown): Promise<unknown>;
}
