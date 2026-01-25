import type { HttpContext } from "./context.js";
import type { HttpMiddleware } from "./middleware.js";
import type { HttpResult } from "./result.js";

/**
 * HTTP facade interface.
 *
 * @comity ai-jsdoc-skip
 */
export interface HttpFacade {
  /**
   * Registers one or more middleware functions.
   *
   * @param middleware - One or more middleware functions to register.
   *
   * @remarks
   * Order matters: middleware registered earlier will be executed before
   * middleware registered later.
   */
  use(...middleware: readonly HttpMiddleware[]): void;

  /**
   * Executes the HTTP pipeline.
   *
   * Used by adapters to process a request.
   *
   * @param ctx - The HTTP context for the current request.
   * @returns A promise resolving to the HTTP result.
   */
  handle(ctx: HttpContext): Promise<HttpResult>;
}
