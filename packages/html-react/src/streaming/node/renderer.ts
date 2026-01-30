import type { HtmlRenderer, HtmlRendererOptions } from "@comity/html-runtime";
import type { HttpHtmlResponse } from "@comity/http";
import type { Result } from "@comity/primitives/result";
import type { ReactElement } from "react";

import { HtmlRenderFailureError } from "@comity/html-runtime/errors";
import { PassThrough, Readable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";

/**
 * React streaming HTML renderer (Node)
 */
export class ReactStreamingHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(
    view: ReactElement,
    options?: HtmlRendererOptions
  ): Promise<Result<HttpHtmlResponse, HtmlRenderFailureError, "ok">> {
    const status = options?.status ?? 200;
    const stream = new PassThrough({ highWaterMark: 16_384 });

    let abort!: () => void;

    const timer = setTimeout(() => {
      abort?.();
      stream.destroy(new Error("SSR timeout"));
    }, options?.timeout ?? 5000);

    try {
      const result = renderToPipeableStream(view, {
        /** @inheritdoc */
        onShellReady() {
          clearTimeout(timer);
          stream.write("<!DOCTYPE html>");
          result.pipe(stream);
        },

        /** @inheritdoc */
        onShellError(error) {
          stream.destroy(error as Error);
        },

        /** @inheritdoc */
        onError(error) {},
      });

      abort = result.abort;

      return {
        ok: true,
        value: {
          intent: "html",
          status: status,
          stream: Readable.toWeb(stream) as ReadableStream<Uint8Array>,
          abort,
          ...(options?.headers && { headers: options.headers }),
        },
      };
    } catch (cause) {
      clearTimeout(timer);
      stream.destroy(cause as Error);

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
