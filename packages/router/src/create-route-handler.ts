import type { HttpHandler } from "@comity/http";
import type { Router, RouteResolutionContext } from "./contracts/router.js";

/**
 * Creates an HTTP handler that resolves incoming requests using the provided router.
 *
 * @param router - Router instance to be wrapped by the returned HTTP handler.
 *
 * @returns An HTTP handler that resolves incoming requests using the provided router.
 */
export function createRouterHttpHandler(router: Router): HttpHandler {
  return async (ctx) => {
    const resolution: RouteResolutionContext = {
      http: ctx,
      url: ctx.request.url,
    };
    const match = await router.match(resolution);

    if (!match) {
      return {
        status: 404,
        body: "Not Found",
      };
    }

    return match.route.handler(ctx);
  };
}
