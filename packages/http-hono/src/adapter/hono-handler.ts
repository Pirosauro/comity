import type { Context as HonoContext } from "hono";
import type { HonoHandlerOptions } from "../types.js";
import { createHttpContextFromHono } from "./context.js";
import { mapHttpResultToResponse } from "./response.js";

/**
 * Creates a Hono-compatible handler that integrates with the Comity HTTP facade.
 *
 * @param options Handler options
 * @returns Hono handler function
 *
 * @example
 * ```typescript
 * import { Hono } from "hono";
 * import { createHonoHandler } from "@comity/http-hono";
 *
 * const app = new Hono();
 *
 * app.get("/api/*", createHonoHandler({ facade }));
 * ```
 */
export function createHonoHandler(
  options: HonoHandlerOptions,
): (c: HonoContext) => Promise<Response> {
  const { facade } = options;

  return async (c: HonoContext): Promise<Response> => {
    // Create HttpContext from Hono context
    const ctx = createHttpContextFromHono(c);

    try {
      // Execute the HTTP facade
      const result = await facade.handle(ctx);

      // Map HttpResult to Response
      return mapHttpResultToResponse(result);
    } catch (error) {
      // If facade.handle throws, return HTTP 500
      return new Response(
        JSON.stringify({
          code: "http:internal",
          message: "Internal server error",
        }),
        {
          status: 500,
          headers: {
            "content-type": "application/json; charset=utf-8",
          },
        },
      );
    }
  };
}
