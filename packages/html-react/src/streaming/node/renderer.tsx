import type { HtmlLayoutCollector, HtmlRenderer, HtmlRenderResult } from "@comity/html";
import type { HttpStatus } from "@comity/http";
import type { ReactElement } from "react";
import { HtmlReactRendererOptions } from "../../types.js";

import { createDefaultHtmlDocumentWriter } from "@comity/html";
import { HtmlError } from "@comity/html/error";
import { PassThrough, Readable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { LayoutProvider } from "../../layout.js";

/**
 * React streaming HTML renderer (Node)
 */
export class ReactStreamingHtmlRenderer implements HtmlRenderer<ReactElement> {
  /** @inheritdoc */
  async render(
    view: ReactElement,
    collector: HtmlLayoutCollector,
    options?: HtmlReactRendererOptions
  ): Promise<HtmlRenderResult> {
    const status: HttpStatus = options?.status ?? 200;
    const outer = new PassThrough({ highWaterMark: 16_384 });
    const inner = new PassThrough({ highWaterMark: 16_384 });
    const tree = <LayoutProvider collector={collector}>{view}</LayoutProvider>;

    let abort!: () => void;

    const timer = setTimeout(() => {
      const error = new Error("SSR timeout");

      abort?.();

      inner.destroy(error);
      outer.destroy(error);
    }, options?.timeout ?? 5000);

    try {
      const writer = createDefaultHtmlDocumentWriter(
        {
          headTags: collector.headTags,
          htmlAttrs: collector.htmlAttrs,
          bodyAttrs: collector.bodyAttrs,
        },
        options
      );
      const result = renderToPipeableStream(tree, {
        /** @inheritdoc */
        onShellReady() {
          clearTimeout(timer);

          outer.write(writer.writeLayoutOpen());
          inner.pipe(outer, { end: false });
          result.pipe(inner);
        },

        /** @inheritdoc */
        onShellError(error) {
          abort?.();

          inner.destroy(error as Error);
          outer.destroy(error as Error);
        },

        /** @inheritdoc */
        onError(error) {
          console.error(error);
        },
      });

      abort = result.abort;

      inner.on("end", () => {
        outer.write(writer.writeLayoutClose());
        outer.end();
      });

      return {
        ok: true,
        value: {
          status: status,
          body: Readable.toWeb(outer) as ReadableStream<Uint8Array>,
          abort,
          ...(options?.headers && { headers: options.headers }),
        },
      };
    } catch (cause) {
      clearTimeout(timer);

      inner.destroy(cause as Error);
      outer.destroy(cause as Error);

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
