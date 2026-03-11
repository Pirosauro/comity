import type { HtmlRenderer, HtmlRendererOptions, HtmlRenderResult } from "@comity/html";
import type { HttpStatus } from "@comity/http";
import type { ReactElement } from "react";

import { HtmlError } from "@comity/html/error";
import { renderToReadableStream } from "react-dom/server";

/**
 * React streaming HTML renderer (Web / Edge)
 */
export class ReactStreamingHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(view: ReactElement, options?: HtmlRendererOptions): Promise<HtmlRenderResult> {
    const status: HttpStatus = options?.status ?? 200;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options?.timeout ?? 5000);

    try {
      const body = await renderToReadableStream(view, {
        signal: controller.signal,
      });

      return {
        ok: true,
        value: {
          status,
          body,
          abort: controller.abort.bind(controller),
          ...(options?.headers && { headers: options.headers }),
        },
      };
    } catch (cause) {
      return {
        ok: false,
        error: new HtmlError("render_error", {
          cause,
          context: {
            renderer: "react",
            mode: "web-streaming",
            layout: String(view.type || "unknown"),
          },
        }),
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
