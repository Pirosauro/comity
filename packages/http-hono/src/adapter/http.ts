import type { HttpAdapter } from "@comity/http";
import type { Hono } from "hono";

import { createHttpContext } from "../internal/context.js";
import { mapHttpResponseToHono } from "../internal/map-response.js";

/**
 * Creates a Hono HTTP adapter.
 *
 * @param hono Hono instance
 *
 * @returns HttpAdapter instance
 *
 * @throws Propagates errors thrown by facade.handle; adapter does not alter error semantics
 *
 * @remarks Pure adapter: maps Hono Context to HttpContext and HttpResult to Response without side effects
 */
export function httpHonoAdapter(hono: Hono): HttpAdapter {
  return {
    /** @inheritdoc */
    attach(facade) {
      hono.use("*", async (c) => {
        const ctx = createHttpContext(c);
        const result = await facade.handle(ctx);

        return result.ok ? mapHttpResponseToHono(c, result.response) : undefined;
      });
    },
  };
}
