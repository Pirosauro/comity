import type { Context } from "hono";
import type {
  ContentfulStatusCode,
  RedirectStatusCode,
} from "hono/utils/http-status";
import type { HttpAdapter } from "../../contracts/adapter.js";
import type { HttpResponse } from "../../contracts/response.js";

import { intentToHeaders } from "../../helpers/intent-to-headers.js";
import { isStreamingResponse } from "../../helpers/is-streaming-response.js";

/**
 * Hono HTTP adapter.
 *
 * Translates HttpResponse objects into Hono runtime responses.
 */
export class HonoHttpAdapter implements HttpAdapter {
  /**
   * Sends an HTTP response
   *
   * @param response The HTTP response to send
   * @param c The Hono context
   * @returns A promise that resolves when the response is sent
   */
  async send(response: HttpResponse, c: Context): Promise<Response> {
    const status = response.status ?? 200;

    // Handle redirect separately
    if (response.intent === "redirect") {
      const location = response.location;

      return c.redirect(location ?? "/", status as RedirectStatusCode);
    }

    // Collect headers
    const headers = {
      ...intentToHeaders(response.intent),
      ...(response.headers ?? {}),
    };

    // Handle streaming response
    if (isStreamingResponse(response)) {
      const stream = response.stream;
      const signal = c.req.raw.signal;

      // Propagate request abort → renderer abort
      if (signal && response.abort) {
        signal.addEventListener("abort", () => response.abort?.(), {
          once: true,
        });
      }

      return c.body(stream, status as ContentfulStatusCode, headers);
    }

    // Handle JSON response with automatic serialization
    if (response.intent === "json") {
      return c.json(response.body, status as ContentfulStatusCode, headers);
    }

    // Handle text and HTML responses
    return c.body(
      // @ts-expect-error
      typeof response.body === "string" ? response.body : String(response.body),
      status as ContentfulStatusCode,
      headers,
    );
  }
}
