/**
 * HTTP error interface.
 */
export interface HttpError {
  /**
   * Stable error code (machine readable).
   */
  code: string;

  /**
   * HTTP status to return.
   */
  status: number;

  /**
   * Human-readable message (optional).
   */
  message?: string;

  /**
   * Optional structured details.
   */
  details?: unknown;

  /**
   * Original error (never serialized).
   */
  cause?: unknown;
}