import type { HttpContext } from "../core/context.js";
import type { HttpResult } from "../core/result.js";
import type { HttpMiddleware } from "../pipeline/middleware.js";

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