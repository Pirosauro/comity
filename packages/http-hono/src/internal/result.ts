import type { HttpResult } from "@comity/http";
import type { Context as HonoContext } from "hono";

/**
 *  Maps an HttpResult to a Hono Response.
 *
 * @param c - Hono context.
 * @param result - HTTP result.
 *
 * @returns Hono Response.
 */
export function mapHttpResultToHono(c: HonoContext, result: HttpResult): Response {
  if (!result.ok) {
    const { error } = result;
    const status = error.status;
    const body = {
      code: error.code,
      ...(error["message"] ? { message: error["message"] } : {}),
    };

    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  }

  const { response } = result;

  return new Response(
    response.body as ReadableStream<Uint8Array> | null,
    {
      status: response.status,
      headers: response.headers,
    } as ResponseInit
  );
}
