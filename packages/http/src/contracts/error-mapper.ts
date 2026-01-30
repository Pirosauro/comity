import type { HttpContext } from "./context.js";
import type { AnyHttpResponse } from "./response.js";

/**
 * Maps errors to HTTP responses.
 *
 * @comity ai-jsdoc-skip
 */
export interface HttpErrorMapper {
  /**
   * Maps an error to an HTTP response.
   *
   * @param error - Error to map.
   * @param ctx - HTTP context.
   *
   * @returns HTTP response.
   */
  map(error: unknown, ctx: HttpContext): AnyHttpResponse;
}
