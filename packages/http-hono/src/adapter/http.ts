import type { HttpHandler } from "@comity/http";
import type { Hono } from "hono";

import { createHttpContext } from "../internal/context.js";
import { mapHttpResponseToHono } from "../internal/map-response.js";

/**
 * Creates a Hono HTTP adapter.
 *
 * @param hono Hono instance
 * @param handler HttpHandler function to handle incoming requests
 *
 * @throws Propagates errors thrown by the handler as HTTP errors to be handled by Hono's error handling mechanism.
 *
 * @remarks Pure adapter: maps Hono Context to HttpContext and HttpResult to Response without side effects
 */
export function httpHonoAdapter(hono: Hono, handler: HttpHandler): void {
  hono.use("*", async (c) => {
    const ctx = createHttpContext(c);
    const result = await handler(ctx);

    if (!result.ok) {
      throw result.error;
    }

    return mapHttpResponseToHono(c, result.value);
  });
}
