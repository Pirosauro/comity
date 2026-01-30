import type { HtmlRenderer, HtmlRendererOptions } from "@comity/html-runtime";
import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { ReactElement } from "react";

import { HtmlRenderFailureError } from "@comity/html-runtime/errors";
import { renderToReadableStream } from "react-dom/server";

/**
 * React streaming HTML renderer (Web / Edge)
 */
export class ReactStreamingHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(
    view: ReactElement,
    options?: HtmlRendererOptions
  ): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">> {
    const status = options?.status ?? 200;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options?.timeout ?? 5000);

    try {
      const stream = await renderToReadableStream(view, {
        signal: controller.signal,
      });

      return {
        ok: true,
        value: {
          intent: "html",
          status: status,
          stream,
          abort: controller.abort.bind(controller),
          ...(options?.headers && { headers: options.headers }),
        },
      };
    } catch (cause) {
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
