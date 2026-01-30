import type { HttpErrorMapper } from "../contracts/error-mapper.js";
import type { HttpError } from "../contracts/error.js";
import type { AnyHttpResponse } from "../contracts/response.js";

/**
 * Checks if an error matches the HttpError interface.
 *
 * @param error - The error to check.
 *
 * @returns true if the error is an instance of HttpError, false otherwise.
 *
 * @comity ai-jsdoc-skip
 */
function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "status" in error &&
    typeof (error as HttpError).code === "string" &&
    typeof (error as HttpError).status === "number"
  );
}

/**
 * Default HTTP error mapper.
 *
 * @comity ai-jsdoc-skip
 */
export const defaultHttpErrorMapper: HttpErrorMapper = {
  /**
   * Maps an error to an HTTP response.
   *
   * @param error - The error to map.
   * @param ctx - The HTTP context (unused in default implementation).
   *
   * @returns An HTTP response.
   */
  map(error, ctx): AnyHttpResponse {
    if (isHttpError(error)) {
      const body: Record<string, unknown> = {
        code: error.code,
      };

      // Include message and details if available
      if (error["message"]) {
        body["message"] = error["message"];
      }

      // Include details if available
      if (error["details"]) {
        body["details"] = error["details"];
      }

      return {
        status: error.status,
        body,
      };
    }

    // Handle aborted requests
    if (error instanceof DOMException && error.name === "AbortError") {
      return { status: 499 };
    }

    return { status: 500 };
  },
};
