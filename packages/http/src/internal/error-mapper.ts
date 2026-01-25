import type { HttpErrorMapper } from "../contracts/error-mapper.js";
import type { HttpError } from "../contracts/error.js";
import type { HttpResponse } from "../contracts/response.js";

/**
 * Checks if an error matches the HttpError interface.
 * @param error
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

export const defaultHttpErrorMapper: HttpErrorMapper = {
  /**
   * Maps an error to an HTTP response.
   * @param error The error to map.
   * @param _ctx The HTTP context (unused in default implementation).
   * @returns An HTTP response.
   */
  map(error, _ctx): HttpResponse {
    if (isHttpError(error)) {
      const body: Record<string, unknown> = {
        code: error.code,
      };

      if (error["message"]) {
        body["message"] = error["message"];
      }

      if (error["details"]) {
        body["details"] = error["details"];
      }

      return {
        status: error.status,
        body,
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return { status: 499 };
    }

    return { status: 500 };
  },
};
