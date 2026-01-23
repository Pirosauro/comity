import type { BaseError, ErrorMeta } from "@comity/core/errors";
import type { HttpResponse } from "../contracts/response.js";

/**
 * Converts an error to an HTTP response
 *
 * @param error Error to convert
 * @returns HTTP response representing the error
 */
export function errorToHttp(error: BaseError): HttpResponse {
  const status = (error.meta as ErrorMeta).httpStatus ?? 500;

  return {
    intent: "json",
    status,
    body: {
      error: {
        code: error.code,
        message: error.message,
        meta: error.meta,
      },
    },
  };
}
