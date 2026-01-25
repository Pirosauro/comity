/** HTTP request lifecycle events. */
export interface HttpEvents {
  /**
   * Emitted when a request begins processing.
   * @param payload - Request start payload.
   */
  requestStarted(payload: {
    /** Request ID. */
    id: string;

    /** HTTP method. */
    method: string;

    /** Request path. */
    path: string;
  }): void;

  /**
   * Emitted when a request completes successfully.
   * @param payload - Request completion payload.
   */
  requestCompleted(payload: {
    /** Request ID. */
    id: string;

    /** HTTP status code. */
    status: number;

    /** Request duration in milliseconds. */
    duration: number;
  }): void;

  /**
   * Emitted when a request fails.
   * @param payload - Request failure payload.
   */
  requestFailed(payload: {
    /** Request ID. */
    id: string;

    /** Error code. */
    code: string;

    /** Request duration in milliseconds. */
    duration: number;
  }): void;
}
