import type { HtmlRenderer, HtmlView } from "@comity/html-runtime";
import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { ReactStreamingHtmlRenderOptions } from "./types.js";

import { HtmlRenderFailureError } from "@comity/html-runtime/errors";
import { renderToReadableStream } from "react-dom/server";

/**
 * React streaming HTML renderer (Web / Edge)
 */
export class ReactStreamingHtmlRenderer implements HtmlRenderer {
  #options: ReactStreamingHtmlRenderOptions;

  /**
   * @param options - Renderer options
   */
  constructor(options: ReactStreamingHtmlRenderOptions) {
    this.#options = options;
  }

  /** @inheritdoc */
  async render(view: HtmlView): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">> {
    const { templates, timeout = 5000, onError } = this.#options;
    const status = view.http?.status ?? 200;
    const template =
      templates[status] ?? (status >= 200 && status < 300 ? templates.default : templates.error);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const stream = await renderToReadableStream(await template(view.data), {
        signal: controller.signal,
      });

      return {
        ok: true,
        value: {
          intent: "html",
          status: status,
          stream,
          abort: controller.abort.bind(controller),
          ...(view.http?.headers && { headers: view.http.headers }),
        },
      };
    } catch (cause) {
      onError?.(cause);

      return {
        ok: false,
        error: new HtmlRenderFailureError({
          reason: "streaming-error",
          cause,
        }),
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
