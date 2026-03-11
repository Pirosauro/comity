import type { HttpResponse } from "@comity/http";
import type { Context as HonoContext } from "hono";

import { setCookie } from "hono/cookie";

/**
 * Redirect status codes as defined in the HTTP specification.
 */
type RedirectStatusCode = 300 | 301 | 302 | 303 | 304 | 307 | 308;

/**
 *  Maps an HttpResponse to a Hono Response.
 *
 * @param c - Hono context.
 * @param response - HTTP response.
 *
 * @returns Hono Response.
 */
export function mapHttpResponseToHono(c: HonoContext, response: HttpResponse): Response {
  const status = response.status ?? 200;
  const headers = new Headers(response.headers);

  // cookies
  if (response.cookies) {
    for (const [name, { value, ...opts }] of Object.entries(response.cookies)) {
      setCookie(c, name, value, opts);
    }
  }

  // redirect shortcut
  if (headers.has("location") && status >= 300 && status < 400) {
    return c.redirect(headers.get("location")!, status as RedirectStatusCode);
  }

  const body = response.body;

  // stream
  if (body instanceof ReadableStream) {
    if (response.abort) {
      c.req.raw.signal.addEventListener("abort", response.abort);
    }

    return new Response(body, {
      status,
      headers,
    });
  }

  // object → json
  if (body && typeof body === "object" && !(body instanceof Uint8Array)) {
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json; charset=utf-8");
    }

    return new Response(JSON.stringify(body), { status, headers });
  }

  // string or Uint8Array
  return new Response(body, {
    status,
    headers,
  });
}
