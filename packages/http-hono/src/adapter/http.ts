import type { HttpFacade, HttpRuntimeContext } from "@comity/http";
import type { Hono } from "hono";

import { createHttpContext } from "../internal/context.js";
import { mapErrorToHttpResponse } from "../internal/map-error.js";
import { mapHttpResponseToHono } from "../internal/map-response.js";

/**
 * Creates a Hono HTTP adapter.
 *
 * @param hono Hono instance
 * @param facade HTTP facade to handle requests
 * @param runtime HTTP runtime context providing access to kernel services and events
 *
 * @throws Propagates errors thrown by the handler as HTTP errors to be handled by Hono's error handling mechanism.
 *
 * @remarks Pure adapter: maps Hono Context to HttpContext and HttpResult to Response without side effects
 */
export function httpHonoAdapter(hono: Hono, facade: HttpFacade, runtime: HttpRuntimeContext): void {
  hono.use("*", async (c) => {
    const ctx = createHttpContext(c, runtime);

    try {
      const response = await facade.handle(ctx);

      return mapHttpResponseToHono(c, response);
    } catch (error) {
      const response = mapErrorToHttpResponse(ctx, error);

      return mapHttpResponseToHono(c, response);
    }
  });
}
