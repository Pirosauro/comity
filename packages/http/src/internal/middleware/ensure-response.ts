import type { HttpMiddleware } from "../../contracts/middleware.js";

/**
 *
 * @param ctx
 * @param next
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
