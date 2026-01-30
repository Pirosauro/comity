/**
 *
 */
export interface HtmlRuntimeEvents {
  /**
   *
   */
  renderStarted?(payload: {
    /**
     *
     */
    renderer: string;
  }): void;

  /**
   *
   */
  renderCompleted?(payload: {
    /**
     *
     */
    renderer: string;
    /**
     *
     */
    duration: number;
    /**
     *
     */
    status?: number;
  }): void;

  /**
   *
   */
  renderFailed?(payload: {
    /**
     *
     */
    renderer: string;
    /**
     *
     */
    duration: number;
    /**
     *
     */
    reason: "timeout" | "renderer-error" | "no-renderer";
  }): void;
}
