import type { HtmlRenderer, HtmlView } from "@comity/html-runtime";
import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { ReactStreamingHtmlRenderOptions } from "../types.js";

import { HtmlRenderFailureError } from "@comity/html-runtime/errors";
import { PassThrough, Readable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";

/**
 * React streaming HTML renderer (Node)
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

    const stream = new PassThrough({ highWaterMark: 16_384 });

    let abort!: () => void;

    const timer = setTimeout(() => {
      abort?.();
      stream.destroy(new Error("SSR timeout"));
    }, timeout);

    try {
      const result = renderToPipeableStream(await template(view.data), {
        /** @inheritdoc */
        onShellReady() {
          clearTimeout(timer);
          stream.write("<!DOCTYPE html>");
          result.pipe(stream);
        },

        /** @inheritdoc */
        onShellError(error) {
          onError?.(error);
          stream.destroy(error as Error);
        },

        /** @inheritdoc */
        onError(error) {
          onError?.(error);
        },
      });

      abort = result.abort;

      return {
        ok: true,
        value: {
          intent: "html",
          status: status,
          stream: Readable.toWeb(stream) as ReadableStream<Uint8Array>,
          abort,
          ...(view.http?.headers && { headers: view.http.headers }),
        },
      };
    } catch (cause) {
      clearTimeout(timer);
      stream.destroy(cause as Error);
      onError?.(cause as Error);

      return {
        ok: false,
        error: new HtmlRenderFailureError({
          reason: "streaming-error",
          cause,
        }),
      };
    }
  }
}
