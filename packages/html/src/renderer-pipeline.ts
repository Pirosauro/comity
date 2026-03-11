import type { HtmlRenderResult } from "./contracts/render-result.js";
import type { HtmlRenderer, HtmlRendererOptions } from "./contracts/renderer.js";
import type { HtmlRendererObserver } from "./hooks/html-renderer.js";

import { toSafePayload } from "@comity/primitives/error";
import { HtmlError } from "./error/html.js";

/**
 * HTML renderer pipeline that attempts to render a view using multiple renderers in order.
 *
 * The pipeline will try each renderer sequentially until one succeeds or all fail.
 * It also notifies an optional observer about the rendering lifecycle events.
 *
 * @typeParam T - Type of the view to render
 */
export class HtmlRendererPipeline<T> implements HtmlRenderer<T> {
  /** */
  #renderers: readonly HtmlRenderer<T>[];

  #observer: HtmlRendererObserver | undefined;

  /**
   * @param renderers - HTML renderers to attempt in order
   * @param observer - Lifecycle events observer
   */
  constructor(renderers: readonly HtmlRenderer<T>[], observer?: HtmlRendererObserver) {
    this.#renderers = renderers;
    this.#observer = observer;
  }

  /** @inheritdoc */
  async render(view: T, options?: HtmlRendererOptions): Promise<HtmlRenderResult> {
    let failure: HtmlRenderResult = {
      ok: false,
      error: new HtmlError("no_renderer"),
    };
    const start = performance.now();

    for (const renderer of this.#renderers) {
      const name = renderer.constructor.name;

      this.#observer?.onRenderStarted?.({ renderer: name });

      // Attempt to render with the current renderer
      const outcome = await renderer.render(view, options);

      // Return on first success
      if (outcome.ok) {
        this.#observer?.onRenderCompleted?.({
          renderer: name,
          duration: performance.now() - start,
        });

        return outcome;
      }

      // Store last failure
      failure = outcome;

      this.#observer?.onRenderFailed?.({
        renderer: name,
        duration: performance.now() - start,
        error: toSafePayload(outcome.error),
      });
    }

    // Notify observer of overall failure after all renderers have been attempted

    this.#observer?.onRenderFailed?.({
      renderer: "none",
      duration: performance.now() - start,
      error: toSafePayload(failure.error),
    });

    return failure;
  }
}
