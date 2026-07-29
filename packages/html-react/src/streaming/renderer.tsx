import type { HtmlLayoutCollector, HtmlRenderer, HtmlRenderResult } from "@comity/html";
import type { HttpStatus } from "@comity/http";
import type { ReactElement } from "react";
import type { HtmlReactRendererOptions } from "../types.js";

import { createDefaultHtmlDocumentWriter } from "@comity/html";
import { HtmlError } from "@comity/html/errors";
import { renderToReadableStream } from "react-dom/server";
import { LayoutProvider } from "../layout.js";

/**
 * React streaming HTML renderer (Web / Edge)
 */
export class ReactStreamingHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(
    view: ReactElement,
    collector: HtmlLayoutCollector,
    options?: HtmlReactRendererOptions
  ): Promise<HtmlRenderResult> {
    const status: HttpStatus = options?.status ?? 200;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options?.timeout ?? 5000);

    try {
      const tree = <LayoutProvider collector={collector}>{view}</LayoutProvider>;
      const body = await renderToReadableStream(tree, {
        signal: controller.signal,
      });
      const writer = createDefaultHtmlDocumentWriter(
        {
          headTags: collector.headTags,
          htmlAttrs: collector.htmlAttrs,
          bodyAttrs: collector.bodyAttrs,
        },
        options
      );
      const prefix = writer.writeLayoutOpen();
      const suffix = writer.writeLayoutClose();

      const stream = new ReadableStream({
        /** @inheritdoc */
        async start(controller) {
          controller.enqueue(new TextEncoder().encode(prefix));

          const reader = body.getReader();

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            controller.enqueue(value);
          }

          controller.enqueue(new TextEncoder().encode(suffix));
          controller.close();
        },
      });

      return {
        ok: true,
        value: {
          status,
          body: stream,
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
