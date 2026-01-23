import type { HtmlContract } from "../contracts/html.js";
import type { HttpResponse } from "../contracts/response.js";

/**
 * Streaming HTML renderer
 */
export interface StreamingHtmlRenderer {
  /**
   * Render HTML as a stream (React, Suspense, etc)
   *
   * @param contract The HTML contract to render
   * @returns Rendered streaming HTML result
   *
   * @remarks
   * If an error occurs during streaming, the implementation should ensure that
   * the stream handles the error gracefully, possibly by sending an error page
   * or a fallback content to the client.
   */
  render<Data extends Record<string, unknown>>(
    contract: HtmlContract<Data>,
  ): Promise<HttpResponse>;
}
