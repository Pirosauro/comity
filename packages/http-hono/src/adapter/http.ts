import type { HttpAdapter } from "@comity/http";
import type { Hono } from "hono";

import { createHttpContext } from "../internal/context.js";
import { mapHttpResultToHono } from "../internal/result.js";

/**
 * Creates a Hono HTTP adapter.
 *
 * @param hono Hono instance
 *
 * @returns HttpAdapter instance
 */
export function httpHonoAdapter(hono: Hono): HttpAdapter {
  return {
    /**
     * @param facade
     */
    attach(facade) {
      hono.use("*", async (c) => {
        const ctx = createHttpContext(c);
        const result = await facade.handle(ctx);

        return mapHttpResultToHono(c, result);
      });
    },
  };
}
