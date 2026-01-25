import type { HttpContext } from "../contracts/context.js";

/**
 * HTTP middleware function.
 *
 * @param ctx - Mutable HTTP context for the current request.
 * @param next - Invokes the next middleware in the chain.
 * @returns A promise that resolves when the next middleware has been invoked, or void if not a promise.
 * @throws {Error} If an error occurs during the execution of the middleware.
 *
 * @comity ai-jsdoc-skip
 */
export type HttpMiddleware = (ctx: HttpContext, next: HttpNext) => Promise<void> | void;

/**
 * Function that invokes the next middleware in the chain.
 *
 * @comity ai-jsdoc-skip
 */
export type HttpNext = () => Promise<void>;
