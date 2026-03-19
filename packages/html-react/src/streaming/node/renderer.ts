import type { HtmlRenderer, HtmlRendererOptions, HtmlRenderResult } from "@comity/html";
import type { HttpStatus } from "@comity/http";
import type { ReactElement } from "react";

import { HtmlError } from "@comity/html/error";
import { PassThrough, Readable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";

/**
 * React streaming HTML renderer (Node)
 */
export class ReactStreamingHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(view: ReactElement, options?: HtmlRendererOptions): Promise<HtmlRenderResult> {
    const status: HttpStatus = options?.status ?? 200;
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
          status: status,
          body: Readable.toWeb(stream) as ReadableStream<Uint8Array>,
          abort,
          ...(options?.headers && { headers: options.headers }),
        },
      };
    } catch (cause) {
      clearTimeout(timer);
      stream.destroy(cause as Error);

      return {
        ok: false,
        error: new HtmlError("render_error", {
          cause,
          context: {
            renderer: "react",
            mode: "node-streaming",
            layout: String(view.type || "unknown"),
          },
        }),
      };
    }
  }
}
