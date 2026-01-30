import type { HtmlRenderer, HtmlView } from "@comity/html-runtime";
import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { ReactStaticHtmlRenderOptions } from "./types.js";

import { HtmlRenderFailureError } from "@comity/html-runtime/errors";
import { renderToString } from "react-dom/server";

/**
 *
 */
export class ReactStaticHtmlRenderer implements HtmlRenderer {
  #options: ReactStaticHtmlRenderOptions;

  /**
   * @param options - Renderer options
   */
  constructor(options: ReactStaticHtmlRenderOptions) {
    this.#options = options;
  }

  /** @inheritdoc */
  async render(view: HtmlView): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">> {
    const { templates, timeout = 5000, onError } = this.#options;
    const status = view.http?.status ?? 200;
    const template =
      templates[status] ?? (status >= 200 && status < 300 ? templates.default : templates.error);

    try {
      const html = renderToString(await template(view.data));

      return {
        ok: true,
        value: {
          intent: "html",
          status,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
          body: html,
        },
      };
    } catch (error) {
      onError?.(error as Error);

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
