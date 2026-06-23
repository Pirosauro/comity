import type { HtmlLayoutCollector, HtmlRenderer, HtmlRenderResult } from "@comity/html";
import type { VNode } from "preact";
import type { HtmlPreactRendererOptions } from "../types.js";

import { createDefaultHtmlDocumentWriter } from "@comity/html";
import { HtmlError } from "@comity/html/error";
import { render } from "preact-render-to-string";
import { LayoutProvider } from "../layout.js";

/**
 * Preact static HTML renderer
 */
export class PreactStaticHtmlRenderer implements HtmlRenderer<VNode> {
  /** @inheritdoc */
  async render(
    view: VNode,
    collector: HtmlLayoutCollector,
    options?: HtmlPreactRendererOptions
  ): Promise<HtmlRenderResult> {
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

      return {
        ok: true,
        value: {
          status: options?.status ?? 200,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            ...(options?.headers ?? {}),
          },
          body: html,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: new HtmlError("render_error", {
          cause: error,
          context: {
            renderer: "preact",
            mode: "static",
            layout: String(view.type || "unknown"),
          },
        }),
      };
    }
  }
}
