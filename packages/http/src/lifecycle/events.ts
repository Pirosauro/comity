import type { HttpError } from "../contracts/error.js";

/**
 *
 */
export interface HttpEvents {
  /**
   *
   */
  requestStarted(payload: {
    /** Request ID */
    id: string;

    /** HTTP method */
    method: string;

    /** Request path */
    path: string;
  }): void;

  /**
   *
   */
  requestCompleted(payload: {
    /** Request ID */
    id: string;

    /** HTTP status code */
    status: number;

    /** Request duration in milliseconds */
    duration: number;
  }): void;
  /**
   *
   */
  requestFailed(payload: {
    /** Request ID */
    id: string;

    /** Error */
    error: HttpError;

    /** Request duration in milliseconds */
    duration: number;
  }): void;
}
