import type { SafeErrorPayload } from "@comity/primitives/error";
import type { HttpRequest } from "../contracts/request.js";
import type { HttpResponse } from "../contracts/response";

/**
 * HTTP observer interface for monitoring HTTP request lifecycle events.
 */
export interface HttpObserver {
  /**
   * Emitted when a request begins processing.
   *
   * @param payload - Request start payload.
   */
  onRequestStarted(payload: HttpRequest): void;

  /**
   * Emitted when a request completes successfully.
   *
   * @param payload - Request completion payload.
   */
  onRequestCompleted(payload: {
    /** The HTTP request. */
    request: HttpRequest;

    /** The HTTP response. */
    response: HttpResponse;

    /** Request duration in milliseconds. */
    duration: number;
  }): void;

  /**
   * Emitted when a request fails.
   *
   * @param payload - Request failure payload.
   */
  onRequestFailed(payload: {
    /** The HTTP request. */
    request: HttpRequest;

    /** The error that occurred during the request. */
    error: SafeErrorPayload;

    /** Request duration in milliseconds. */
    duration: number;
  }): void;
}
