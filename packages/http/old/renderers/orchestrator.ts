import type { HtmlContract } from "../contracts/html.js";
import type { HttpResponse } from "../contracts/response.js";
import type { StaticHtmlRenderer } from "./static.js";
import type { StreamingHtmlRenderer } from "./streaming.js";

/**
 * Html rendering orchestrator
 */
export class HtmlRendererOrchestrator {
  /** HTML renderers */
  #renderers: (StaticHtmlRenderer | StreamingHtmlRenderer)[];

  /**
   * @param renderers HTML renderers to use
   */
  constructor(
    renderers:
      | [StaticHtmlRenderer | StreamingHtmlRenderer]
      | [
          StaticHtmlRenderer | StreamingHtmlRenderer,
          StaticHtmlRenderer | StreamingHtmlRenderer,
        ],
  ) {
    if (renderers.length < 1) {
      throw new Error("HtmlRenderer requires at least one renderer");
    }

    this.#renderers = renderers;
  }

  /**
   * Render HTML based on the provided contract and context.
   * Chooses between static and streaming rendering modes.
   *
   * @param contract The HTML contract to render
   * @param context The rendering context
   * @returns Rendered HTML result, either static or streaming
   */
  async render<Data extends Record<string, unknown>>(
    contract: HtmlContract<Data>,
  ): Promise<HttpResponse> {
    for (const renderer of this.#renderers) {
      try {
        return await renderer.render(contract);
      } catch {
        // fallback to static rendering
      }
    }

    // Fallback response in case all renderers fail
    return {
      intent: "html",
      status: 500,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
      body: "<!DOCTYPE html><html><body><h1>Internal Error</h1></body></html>",
    };
  }
}
