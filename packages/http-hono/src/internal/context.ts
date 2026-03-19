import type { HttpContext, HttpMethod, HttpRequest, HttpRuntimeContext } from "@comity/http";
import type { Context as HonoContext } from "hono";
import type { HttpHonoModuleContext } from "../setup/types.js";

import { getCookie } from "hono/cookie";

/**
 * Converts a Headers object to a plain record of header key-value pairs.
 *
 * @param headers - The Headers object to convert.
 *
 * @returns A record where each key is a header name (in lowercase) and each value is the corresponding header value.
 */
export function headersToRecord(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};

  headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });

  return out;
}

/**
 * Creates an HTTP context from a Hono context.
 *
 * @param c - Hono context.
 * @param runtime - HTTP runtime context providing access to kernel services and events.
 *
 * @param runtime
 *
 * @returns HTTP context.
 */
export function createHttpContext(c: HonoContext, runtime: HttpRuntimeContext): HttpContext {
  const state: Record<string, unknown> = {};
  const headers = headersToRecord(c.req.raw.headers);
  const params = {
    ...c.req.param(),
  };
  const cookies = {
    ...getCookie(c),
  };
  const request: HttpRequest = {
    id: crypto.randomUUID(),
    method: c.req.method as HttpMethod,
    url: new URL(c.req.url),
    headers,
    params,
    cookies,
    rawBody: c.req.raw.body ?? null,
  };

  return {
    /** @inheritdoc */
    get request() {
      return request;
    },

    /** @inheritdoc */
    get signal() {
      return c.req.raw.signal;
    },

    /** @inheritdoc */
    get state() {
      return state;
    },

    /** @inheritdoc */
    get services() {
      return runtime.services;
    },

    /** @inheritdoc */
    get events() {
      return runtime.events;
    },
  };
}
