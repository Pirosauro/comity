import type { HttpContext } from "./context.js";
import type { HttpResponse } from "./response.js";

/**
 * Maps an error to an HTTP response.
 */
export interface HttpErrorMapper {
  /**
   *
   */
  map(error: unknown, ctx: HttpContext): HttpResponse;
}
