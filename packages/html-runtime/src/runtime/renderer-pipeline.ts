import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { HtmlRuntimeEvents } from "../lifecycle/events.js";
import type { HtmlRenderer, HtmlRendererOptions } from "./renderer.js";

import { HtmlRenderFailureError } from "../errors/render-failure.js";

/**
 *
 */
export class HtmlRendererPipeline<T> implements HtmlRenderer<T> {
  /** */
  #renderers: readonly HtmlRenderer<T>[];

  #emitter: HtmlRuntimeEvents | undefined;

  /**
   * @param renderers - HTML renderers to attempt in order
   * @param emitter - Lifecycle events emitter
   */
  constructor(renderers: readonly HtmlRenderer<T>[], emitter?: HtmlRuntimeEvents) {
    this.#renderers = renderers;
    this.#emitter = emitter;
  }

  /** @inheritdoc */
  async render(
    view: T,
    options?: HtmlRendererOptions
  ): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">> {
    let failure: Result<HttpHtmlResponse, HtmlRenderFailureError, "ok"> | undefined = undefined;
    const start = performance.now();

    for (const renderer of this.#renderers) {
      const name = renderer.constructor.name;

      this.#emitter?.renderStarted?.({ renderer: name });

      // Attempt to render with the current renderer
      const outcome = await renderer.render(view, options);

      // Return on first success
      if (outcome.ok) {
        this.#emitter?.renderCompleted?.({
          renderer: name,
          duration: performance.now() - start,
        });

        return outcome;
      }

      // Store last failure
      failure = outcome;

      this.#emitter?.renderFailed?.({
        renderer: name,
        duration: performance.now() - start,
        reason: "renderer-error",
      });
    }

    // Return last failure if any renderer failed
    if (failure) {
      return failure;
    }

    this.#emitter?.renderFailed?.({
      renderer: "none",
      duration: performance.now() - start,
      reason: "no-renderer",
    });

    return {
      ok: false,
      error: new HtmlRenderFailureError({
        reason: "no-renderer-available",
      }),
    };
  }
}
