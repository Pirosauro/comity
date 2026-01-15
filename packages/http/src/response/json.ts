import type { HttpJsonResponse } from "../contracts/response.js";

/**
 * Creates a JSON HTTP response
 *
 * @param body The body of the JSON response
 * @param status The HTTP status code
 * @param headers Optional HTTP headers
 * @returns The JSON HTTP response
 */
export function json(
  body: unknown,
  status: number = 200,
  headers?: Record<string, string>,
): HttpJsonResponse {
  return { intent: "json", status, body, headers };
}
