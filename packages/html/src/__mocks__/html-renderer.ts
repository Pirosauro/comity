import type { HttpResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { HtmlRenderer } from "../contracts/renderer.js";

import { HtmlError } from "../errors/html.js";

/**
 * Mock HTML renderer for testing purposes
 */
export class MockRenderer implements HtmlRenderer<unknown> {
  constructor(private shouldSucceed: boolean = true) {}

  /**
   * @param view - The view to render
   * @param collector - The layout collector (ignored in this mock)
   * @param options - Render options (ignored in this mock)
   *
   * @returns A successful response if `shouldSucceed` is true, otherwise an error
   */
  async render(
    view: unknown,
    collector: unknown,
    options?: undefined
  ): Promise<Result<HttpResponse, HtmlError, "ok">> {
    if (this.shouldSucceed) {
      return {
        ok: true,
        value: {
          status: 200,
          headers: { "Content-Type": "text/html" },
          body: `<div>${view}</div>`,
        },
      };
    } else {
      return {
        ok: false,
        error: new HtmlError("render_error"),
      };
    }
  }
}
