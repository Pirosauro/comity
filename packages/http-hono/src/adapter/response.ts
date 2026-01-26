import type { HttpResult } from "@comity/http";

/**
 * Maps an HttpResult to a Web Standard Response.
 *
 * @param result HTTP result from the facade
 * @returns Web Standard Response
 */
export function mapHttpResultToResponse(result: HttpResult): Response {
  if (result.ok) {
    const { status, headers, body } = result.response;

    const responseHeaders = new Headers(headers);

    // Determine response body
    let responseBody: BodyInit | null = null;
    if (body !== undefined) {
      if (typeof body === "string") {
        responseBody = body;
        if (!responseHeaders.has("content-type")) {
          responseHeaders.set("content-type", "text/plain; charset=utf-8");
        }
      } else if (body instanceof Uint8Array) {
        responseBody = body as unknown as BodyInit;
        if (!responseHeaders.has("content-type")) {
          responseHeaders.set("content-type", "application/octet-stream");
        }
      } else if (body instanceof ArrayBuffer) {
        responseBody = new Uint8Array(body) as unknown as BodyInit;
        if (!responseHeaders.has("content-type")) {
          responseHeaders.set("content-type", "application/octet-stream");
        }
      } else if (body instanceof ReadableStream) {
        responseBody = body;
      } else {
        // Serialize as JSON
        responseBody = JSON.stringify(body);
        if (!responseHeaders.has("content-type")) {
          responseHeaders.set("content-type", "application/json; charset=utf-8");
        }
      }
    }

    return new Response(responseBody, {
      status,
      headers: responseHeaders,
    });
  } else {
    // Error result
    const { error } = result;
    const status = error.status;

    const errorBody: Record<string, unknown> = {
      code: error.code,
    };

    if (error["message"]) {
      errorBody["message"] = error["message"];
    }

    if (error["details"]) {
      errorBody["details"] = error["details"];
    }

    const responseBody = JSON.stringify(errorBody);

    return new Response(responseBody, {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }
}
