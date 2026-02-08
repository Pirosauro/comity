import type { FunctionComponent } from "react";

/**
 * Shared options for React streaming HTML renderers
 */
export interface ReactStreamingHtmlRenderOptions<T = {}> {
  /**
   * Page templates
   */
  templates: {
    /** Template used on success */
    default: FunctionComponent<T>;

    /** Template used on error */
    error: FunctionComponent<T>;

    /** Indexed templates for advanced usage */
    [key: number]: FunctionComponent<T>;
  };

  /** Optional render timeout (ms) */
  timeout?: number;
}
