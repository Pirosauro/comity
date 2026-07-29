import type { HtmlLayoutCollector, HtmlRenderer, HtmlRenderResult } from "@comity/html";
import type { HttpStatus } from "@comity/http";
import type { VNode } from "preact";
import type { HtmlPreactRendererOptions } from "../types.js";

import { createDefaultHtmlDocumentWriter } from "@comity/html";
import { HtmlError } from "@comity/html/errors";
import { render } from "preact-render-to-string";
import { LayoutProvider } from "../layout.js";

/**
 * Preact streaming HTML renderer (Web / Edge)
 */
export class PreactStreamingHtmlRenderer implements HtmlRenderer<VNode> {
  /** @inheritdoc */
  async render(
    view: VNode,
    collector: HtmlLayoutCollector,
    options?: HtmlPreactRendererOptions
  ): Promise<HtmlRenderResult> {
    const status: HttpStatus = options?.status ?? 200;
    const abort = () => {};

    try {
      const tree = <LayoutProvider collector={collector}>{view}</LayoutProvider>;
      const body = render(tree);
      const writer = createDefaultHtmlDocumentWriter(
        {
          headTags: collector.headTags,
          htmlAttrs: collector.htmlAttrs,
          bodyAttrs: collector.bodyAttrs,
        },
        options
      );
      const html = writer.writeLayoutOpen() + body + writer.writeLayoutClose();
      const payload = new TextEncoder().encode(html);

      const stream = new ReadableStream({
        /** @inheritdoc */
        start(controller) {
          controller.enqueue(payload);
          controller.close();
        },
      });

      return {
        ok: true,
        value: {
          status,
          body: stream,
          abort,
          ...(options?.headers && { headers: options.headers }),
        },
      };
    } catch (cause) {
      return {
        ok: false,
        error: new HtmlError("render_error", {
          cause,
          context: {
            renderer: "preact",
            mode: "web-streaming",
            layout: String(view.type || "unknown"),
          },
        }),
      };
    }
  }
}
