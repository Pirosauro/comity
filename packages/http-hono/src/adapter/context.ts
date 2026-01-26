import type { Context as HonoContext } from "hono";
import type { HttpContext, HttpMethod, HttpRequest } from "@comity/http";
import { createHttpState } from "@comity/http";
import type { EventBus } from "@comity/primitives/lifecycle";

/**
 * Creates an HttpContext from a Hono Context.
 *
 * @param c Hono context
 * @param eventBus Optional event bus for emitting events
 * @returns HttpContext instance
 */
export function createHttpContextFromHono(
  c: HonoContext,
  eventBus?: EventBus<Record<string, unknown>>,
): HttpContext {
  const url = new URL(c.req.url);
  const headers: Record<string, string> = {};

  // Extract headers
  c.req.raw.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  // Extract query parameters
  const query: Record<string, string | readonly string[]> = {};
  url.searchParams.forEach((value, key) => {
    const existing = query[key];
    if (existing === undefined) {
      query[key] = value;
    } else if (Array.isArray(existing)) {
      query[key] = [...existing, value] as readonly string[];
    } else {
      query[key] = [existing, value] as readonly string[];
    }
  });

  // Extract path parameters from Hono
  const params: Record<string, string> = c.req.param() || {};

  const request: HttpRequest = {
    id: crypto.randomUUID(),
    method: c.req.method as HttpMethod,
    url,
    headers,
    query,
    params,
    body: undefined,
    rawBody: c.req.raw,
  };

  const state = createHttpState();
  let response: HttpContext["response"];

  const context: HttpContext = {
    request,
    state,
    signal: c.req.raw.signal,
    get response() {
      return response;
    },
    setResponse(result: HttpContext["response"]) {
      if (response !== undefined) {
        throw new Error("Response already set");
      }
      response = result;
    },
  };

  return context;
}
