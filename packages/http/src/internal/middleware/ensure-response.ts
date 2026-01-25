import type { HttpMiddleware } from "../../contracts/middleware.js";

/**
 * Middleware that ensures a response is set (defaults to 404 if needed).
 * @param ctx - HTTP context.
 * @param next - Function to invoke the next middleware.
 */
export const ensureResponse: HttpMiddleware = async (ctx, next) => {
  await next();

  if (!ctx.response) {
    ctx.setResponse({
      ok: true,
      response: { status: 404 },
    });
  }
};
