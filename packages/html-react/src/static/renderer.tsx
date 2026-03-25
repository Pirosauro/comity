import type { HtmlLayoutCollector, HtmlRenderer, HtmlRenderResult } from "@comity/html";
import type { ReactElement } from "react";
import type { HtmlReactRendererOptions } from "../types.js";

import { createDefaultHtmlDocumentWriter } from "@comity/html";
import { HtmlError } from "@comity/html/error";
import { renderToString } from "react-dom/server";
import { LayoutProvider } from "../layout.js";

/**
 * React static HTML renderer
 */
export class ReactStaticHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(
    view: ReactElement,
    collector: HtmlLayoutCollector,
    options?: HtmlReactRendererOptions
  ): Promise<HtmlRenderResult> {
    try {
      const tree = <LayoutProvider collector={collector}>{view}</LayoutProvider>;
      const writer = createDefaultHtmlDocumentWriter(
        {
          headTags: collector.headTags,
          htmlAttrs: collector.htmlAttrs,
          bodyAttrs: collector.bodyAttrs,
        },
        options
      );
      const body = renderToString(tree);
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
            renderer: "react",
            mode: "static",
            layout: String(view.type || "unknown"),
          },
        }),
      };
    }
  }
}
