import type { HttpMiddleware } from "../../contracts/middleware.js";

/**
 * Middleware that throws if the request has been aborted.
 *
 * @param ctx - HTTP context.
 * @param next - Function to invoke the next middleware.
 *
 * @throws {DOMException} - Throws an error if the request is aborted.
 *
 * @comity ai-jsdoc-skip
 */
export const abortMiddleware: HttpMiddleware = async (ctx, next) => {
  if (ctx.signal.aborted) {
    throw new DOMException("Request aborted", "AbortError");
  }

  await next();
};
