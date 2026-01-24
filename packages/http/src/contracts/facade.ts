import type { HttpMiddleware } from "./middleware.js";
import type { HttpContext } from "./context.js";
import type { HttpResult } from "./result.js";

/**
 * HTTP facade interface.
 */
export interface HttpFacade {
  /**
   * Registers one or more middleware.
   *
   * Order matters.
   */
  use(...middleware: readonly HttpMiddleware[]): void;

  /**
   * Executes the HTTP pipeline.
   *
   * Used by adapters to process a request.
   */
  handle(ctx: HttpContext): Promise<HttpResult>;
}
