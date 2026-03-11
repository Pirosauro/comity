import type { HttpCookie } from "./cookie.js";
import type { HttpStatus } from "./status.js";

/**
 * HTTP body type.
 */
export type HttpBody = string | Uint8Array | ReadableStream | object | null | undefined;

/**
 * Represents an HTTP response.
 *
 * @reamrks
 * Not readonly to allow middleware to modify the response object before it's finalized.
 */
export interface HttpResponse {
  /** HTTP status code. */
  status?: HttpStatus;

  /** HTTP headers. */
  headers?: Record<string, string>;

  /** HTTP cookies. */
  cookies?: Record<string, HttpCookie>;

  /** HTTP body. */
  body?: HttpBody;

  /** Abort function. */
  abort?: () => void;
}
