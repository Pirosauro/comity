import type { HtmlRenderer, HtmlRendererOptions } from "@comity/html-runtime";
import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { ReactElement } from "react";

import { HtmlRenderFailureError } from "@comity/html-runtime/errors";
import { renderToString } from "react-dom/server";

/**
 *
 */
export class ReactStaticHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(
    view: ReactElement,
    options?: HtmlRendererOptions
  ): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">> {
    try {
      const html = renderToString(view);

      return {
        ok: true,
        value: {
          intent: "html",
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
        error: new HtmlRenderFailureError({
          reason: "rendering-error",
          cause: error as Error,
        }),
      };
    }
  }
}
