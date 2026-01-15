import type { HttpIntent } from "../contracts/response.js";

/**
 * Converts an HTTP intent to corresponding headers
 *
 * @param intent The HTTP intent
 * @returns The corresponding HTTP headers
 */
export function intentToHeaders(intent: HttpIntent): Record<string, string> {
  switch (intent) {
    case "html":
      return { "content-type": "text/html; charset=utf-8" };

    case "json":
      return { "content-type": "application/json; charset=utf-8" };

    case "text":
      return { "content-type": "text/plain; charset=utf-8" };

    case "event-stream":
      return { "content-type": "text/event-stream" };

    default:
      return {};
  }
}
