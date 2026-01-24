import type { HttpError } from "./error.js";
import type { HttpResponse } from "./response.js";

/**
 * HTTP result type.
 */
export type HttpResult =
  | {
      /** Success result */
      ok: true;

      /** Response */
      response: HttpResponse;
    }
  | {
      /** Failure result */
      ok: false;

      /** Error */
      error: HttpError;
    };
