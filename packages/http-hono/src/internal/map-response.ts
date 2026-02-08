import type { AnyHttpResponse } from "@comity/http";
import type { Context as HonoContext } from "hono";

/**
 *  Maps an HttpResponse to a Hono Response.
 *
 * @param c - Hono context.
 * @param response - HTTP response.
 *
 * @returns Hono Response.
 */
export function mapHttpResponseToHono(c: HonoContext, response: AnyHttpResponse): Response {
  // Handle redirect intent
  if ("intent" in response && response.intent === "redirect") {
    return c.redirect(response.location, response.status);
  }

  // Handle headers
  const headers = new Headers(response.headers || {});

  // Set Content-Type based on intent if not already set
  if (!headers.has("Content-Type") && "intent" in response) {
    switch (response.intent) {
      case "json":
        headers.set("Content-Type", "application/json; charset=utf-8");
        break;

      case "html":
        headers.set("Content-Type", "text/html; charset=utf-8");
        break;

      case "text":
      default:
        headers.set("Content-Type", "text/plain; charset=utf-8");
        break;
    }
  }

  // Handle streaming response
  if ("stream" in response) {
    return new Response(
      response.stream as ReadableStream<Uint8Array> | null,
      {
        status: response.status || 200,
        headers,
      } as ResponseInit
    );
  }

  // Handle regular response
  return new Response("body" in response ? (response.body as string | null) : null, {
    status: response.status || 200,
    headers,
  } as ResponseInit);
}
