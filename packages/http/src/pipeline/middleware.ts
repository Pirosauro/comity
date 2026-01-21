import type { HttpContext } from "../core/context.js";

/**
 * HTTP middleware function.
 * @param ctx Mutable HTTP context for the current request.
 * @param next Invokes the next middleware in the chain.
 * @returns A promise when asynchronous work is performed.
 * @example
 * const logger: HttpMiddleware = async (ctx, next) => {
 *   console.time("request");
 *   await next();
 *   console.timeEnd("request");
 * };
 */
export type HttpMiddleware = (
  ctx: HttpContext,
  next: HttpNext
) => Promise<void> | void;

/**
 * HTTP next function.
 * @returns A promise that resolves when downstream middleware completes.
 * @example
 * await next();
 */
export type HttpNext = () => Promise<void>;