import type { HttpTransport } from "@comity/http";
import type { HttpOptions } from "./client.js";

import { client } from "./client.js";

/**
 * Fetch-based HTTP transport.
 *
 * Implements the `HttpTransport` contract using the global fetch API.
 */
export class FetchHttpClient implements HttpTransport {
  /**
   * Execute an HTTP request.
   *
   * @param input - Request URL or Request object.
   * @param init - Fetch client options including timeout and delay.
   *
   * @returns Promise resolving to the HTTP response.
   */
  async request(input: Request | URL, init?: HttpOptions): Promise<Response> {
    return client(input, init);
  }
}
