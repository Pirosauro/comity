import type { HttpHtmlResponse } from "../contracts/response.js";

/**
 * Creates an HTML HTTP response
 *
 * @param body The body of the HTML response
 * @param status The HTTP status code
 * @param headers Optional HTTP headers
 * @returns The HTML HTTP response
 */
export function html(
  body: string,
  status = 200,
  headers?: Record<string, string>,
): HttpHtmlResponse {
  return { intent: "html", status, body, headers };
}
