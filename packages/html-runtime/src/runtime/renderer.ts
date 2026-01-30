import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { HtmlView } from "../contracts/view.js";
import type { HtmlRenderFailureError } from "../errors/render-failure.js";

/**
 *
 */
export interface HtmlRenderer {
  /**
   * Attempts to render the given contract.
   *
   * @param contract - HTML contract to render
   *
   * @returns Render result
   */
  render(contract: HtmlView): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">>;
}
