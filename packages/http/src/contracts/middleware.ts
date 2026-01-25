import type { HttpContext } from "../contracts/context.js";

/**
 * HTTP middleware function.
 * @param ctx - Mutable HTTP context for the current request.
 * @param next - Invokes the next middleware in the chain.
 */
export type HttpMiddleware = (ctx: HttpContext, next: HttpNext) => Promise<void> | void;

/** Function that invokes the next middleware in the chain. */
export type HttpNext = () => Promise<void>;
