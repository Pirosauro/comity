/**
 *
 */
export interface HttpEvents {
  /**
   *
   */
  requestStarted(payload: {
    /** HTTP method */
    method: string;

    /** Request path */
    path: string;
  }): void;

  /**
   *
   */
  requestSucceeded(payload: {
    /**
     *
     */
    status: number;
  }): void;
  /**
   *
   */
  requestFailed(payload: {
    /**
     *
     */
    reason: string;
  }): void;
}
