import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { HtmlView } from "../contracts/view.js";
import type { HtmlRenderer } from "./renderer.js";

import { HtmlRenderFailureError } from "../errors/render-failure.js";

/**
 *
 */
export class HtmlRenderPipeline implements HtmlRenderer {
  /** */
  #renderers: readonly HtmlRenderer[];

  /**
   * @param renderers HTML renderers to attempt in order
   */
  constructor(renderers: readonly HtmlRenderer[]) {
    this.#renderers = renderers;
  }

  /** @inheritdoc */
  async render(view: HtmlView): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">> {
    let failure: Result<HttpHtmlResponse, HtmlRenderFailureError, "ok"> | undefined = undefined;

    for (const renderer of this.#renderers) {
      // Attempt to render with the current renderer
      const outcome = await renderer.render(view);

      // Return on first success
      if (outcome.ok) {
        return outcome;
      }

      // Store last failure
      failure = outcome;
    }

    return (
      failure ?? {
        ok: false,
        error: new HtmlRenderFailureError({
          reason: "no-renderer-available",
        }),
      }
    );
  }
}
