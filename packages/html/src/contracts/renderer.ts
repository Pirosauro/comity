import type { HttpStatus } from "@comity/http";
import type { HtmlLayoutCollector } from "./layout.js";
import type { HtmlRenderResult } from "./render-result.js";

/**
 * HTML render options
 */
export interface HtmlRendererOptions {
  /** HTTP status code */
  status?: HttpStatus;

  /** HTTP headers to include in the response */
  headers?: Record<string, string>;

  /** Time in milliseconds */
  timeout?: number;
}

/**
 * HTML renderer contract
 */
export interface HtmlRenderer<T> {
  /**
   * Attempts to render the given view.
   *
   * @param view - HTML view to render
   * @param collector - HTML layout collector
   * @param options - Render options
   *
   * @returns Render result
   *
   * @typeparam T - Type of HTML view
   */
  render(
    view: T,
    collector: HtmlLayoutCollector,
    options?: HtmlRendererOptions
  ): Promise<HtmlRenderResult>;
}
