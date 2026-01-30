import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { HtmlRenderFailureError } from "../errors/render-failure.js";

/**
 * HTML render options
 */
export interface HtmlRendererOptions {
  /** HTTP status code */
  status?: number;

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
   * @param options - Render options
   *
   * @returns Render result
   *
   * @typeparam T - Type of HTML view
   */
  render(
    view: T,
    options?: HtmlRendererOptions
  ): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">>;
}
