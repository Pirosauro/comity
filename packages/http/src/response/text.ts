import type { HttpTextResponse } from "../contracts/response.js";

/**
 * Creates a text HTTP response
 *
 * @param body The body of the text response
 * @param status The HTTP status code
 * @param headers Optional HTTP headers
 * @returns The text HTTP response
 */
export function text(
  body: string,
  status = 200,
  headers?: Record<string, string>,
): HttpTextResponse {
  return { intent: "text", status, body, headers };
}
