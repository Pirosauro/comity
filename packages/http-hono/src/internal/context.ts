import type { HttpContext, HttpRequest, HttpResult } from "@comity/http";
import type { Context as HonoContext } from "hono";

/**
 * Creates an HTTP context from a Hono context.
 * 
 * @param c - Hono context.
 * 
 * @returns HTTP context.
 */
export function createHttpContext(c: HonoContext): HttpContext {
  const request: HttpRequest = {
    id: crypto.randomUUID(),
    method: c.req.method as HttpRequest["method"],
    url: new URL(c.req.url),
    headers: c.req.header(),
    body: c.req.raw.body ?? null,
    query: c.req.query(),
    params: c.req.param(),
  };

  let response: HttpResult | undefined;

  return {
    /** @inheritdoc */
    get request() {
      return request;
    },
    
    /** @inheritdoc */
    get state() {
      return c.env;
    },

    /** @inheritdoc */
    get signal() {
      return c.req.raw.signal
    },

    /** @inheritdoc */
    get response() {
      return response;
    },

    /** @inheritdoc */
    setResponse(result: HttpResult): void {
      if (response) {
        throw new Error("HttpContext.response already set");
      }

      response = result;
    },
  };
}
