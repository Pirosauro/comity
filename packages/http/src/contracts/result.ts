import type { HttpError } from "./error.js";
import type { AnyHttpResponse } from "./response.js";

/**
 * HTTP result.
 *
 * @comity ai-jsdoc-skip
 */
export type HttpResult =
  | {
      /** Success result. */
      ok: true;

      /** Response. */
      response: AnyHttpResponse;
    }
  | {
      /** Failure result. */
      ok: false;

      /** Error. */
      error: HttpError;
    };
