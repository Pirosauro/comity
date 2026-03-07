import type { HttpContext } from "./context.js";
import type { AnyHttpResponse } from "./response.js";

/**
 * HTTP handler function.
 *
 * @param ctx - Mutable HTTP context for the current request.
 *
 * @returns A promise that resolves to an HTTP response.
 *
 * @throws {Error} If an unexpected error occurs during the execution of the handler.
 */
export type HttpHandler = (ctx: HttpContext) => Promise<AnyHttpResponse>;
