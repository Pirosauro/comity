import type { HttpMiddleware } from "../../contracts/middleware.js";

/**
 *
 * @param ctx
 * @param next
 */
export const abortMiddleware: HttpMiddleware = async (ctx, next) => {
  if (ctx.signal.aborted) {
    throw new DOMException("Request aborted", "AbortError");
  }

  await next();
};
