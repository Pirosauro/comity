import type { HtmlRenderer, HtmlRendererOptions, HtmlRenderResult } from "@comity/html";
import type { ReactElement } from "react";

import { HtmlError } from "@comity/html/error";
import { renderToString } from "react-dom/server";

/**
 * React static HTML renderer
 */
export class ReactStaticHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(view: ReactElement, options?: HtmlRendererOptions): Promise<HtmlRenderResult> {
    try {
      const html = renderToString(view);

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
