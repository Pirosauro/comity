import type { FunctionComponent } from "react";

/**
 *
 */
export interface ReactStaticHtmlRenderOptions<T = {}> {
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

  /**
   * Timeout for rendering operations (in milliseconds).
   *
   * @defaultValue 5000
   */
  timeout?: number;

  /**
   * Prefix for HTML element identifiers to avoid collisions.
   */
  identifierPrefix?: string;
}
