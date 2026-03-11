import type { HttpContext } from "../contracts/context.js";
import type { HttpResponse } from "./response.js";

/**
 * HTTP middleware function.
 *
 * @param ctx - Mutable HTTP context for the current request.
 * @param next - Invokes the next middleware in the chain.
 *
 * @returns A promise that resolves to an HTTP response.
 *
 * @throws {HttpError} If an error occurs during the execution of the middleware.
 */
export type HttpMiddleware = (ctx: HttpContext, next: HttpNext) => Promise<HttpResponse>;

/**
 * Function that invokes the next middleware in the chain.
 */
export type HttpNext = () => Promise<HttpResponse>;
