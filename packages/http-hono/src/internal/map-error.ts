import type { HttpContext, HttpRequest, HttpResponse } from "@comity/http";

import { BaseError } from "@comity/primitives/error";

/**
 * Determines the preferred response type based on the Accept header of the request.
 *
 * @param request - The HTTP request object.
 *
 * @returns The preferred response type: "json", "html", or "text".
 */
function getPreferredType(request: HttpRequest): "json" | "html" | "text" {
  const accept = request.headers["accept"] ?? "";

  if (accept.includes("text/html")) return "html";

  if (accept.includes("application/json")) return "json";

  return "text";
}

/**
 * Maps an error to an HTTP response based on the preferred response type of the request.
 *
 * @param ctx - The HTTP context containing the request information.
 * @param error - The error to be mapped to an HTTP response.
 *
 * @returns An HTTP response representing the error, with content type and body formatted according to the preferred response type of the request.
 */
export function mapErrorToHttpResponse(ctx: HttpContext, error: unknown): HttpResponse {
  const type = getPreferredType(ctx.request);
  const info =
    error instanceof BaseError
      ? {
          status: error.meta?.["httpStatus"] ?? 500,
          code: error.code,
          reason: error.meta?.["reason"],
          message: error.message,
        }
      : {
          status: 500,
          code: "internal",
          message: error instanceof Error ? error.message : "Internal Server Error",
        };

  switch (type) {
    case "json":
      return {
        status: info.status,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
        body: {
          error: info,
        },
      };

    case "html":
      return {
        status: info.status,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
        body:
          '<DOCTYPE html><html lang="en"><body><h1>' +
          info.code +
          "</h1><p>" +
          info.message +
          "</p></body></html>",
      };

    default:
      return {
        status: info.status,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
        body: `[${info.code}] ${info.message}`,
      };
  }
}
