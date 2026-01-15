import type {
  HttpHtmlResponse,
  HttpJsonResponse,
  HttpResponse,
  HttpStreamingResponse,
  HttpTextResponse,
} from "../contracts/response.js";

/**
 * Checks if the response is a streaming response
 *
 * @param response The HTTP response to check
 * @returns True if the response is a streaming response, false otherwise
 */
export function isStreamingResponse(
  response: HttpResponse,
): response is
  | (HttpTextResponse & HttpStreamingResponse)
  | (HttpJsonResponse & HttpStreamingResponse)
  | (HttpHtmlResponse & HttpStreamingResponse) {
  return (
    response !== null && typeof response === "object" && "stream" in response
  );
}
