import type { HtmlContract } from "../contracts/html.js";
import type { HttpResponse } from "../contracts/response.js";

/**
 * Static HTML renderer
 */
export interface StaticHtmlRenderer {
  /**
   * Render a complete HTML document as a string
   *
   * @param contract The HTML contract to render
   * @returns Rendered static HTML result
   *
   * @remarks
   * Implementations should handle errors internally and
   * always return a valid HTML string.
   */
  render<Data extends Record<string, unknown>>(
    contract: HtmlContract<Data>,
  ): Promise<HttpResponse> | HttpResponse;
}
