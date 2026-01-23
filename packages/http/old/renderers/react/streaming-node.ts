import type { HtmlContract } from "../../contracts/html.js";
import type { HttpResponse } from "../../contracts/response.js";
import type { StreamingHtmlRenderer } from "../streaming.js";
import type { ReactStreamingHtmlRenderOptions } from "./types.js";

import { PassThrough, Readable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";

/**
 * Streaming HTML renderer for React templates
 */
export class ReactStreamingHtmlRenderer implements StreamingHtmlRenderer {
  /** Options for rendering */
  #options: ReactStreamingHtmlRenderOptions;

  /**
   * @param options Options for rendering
   */
  constructor(options: ReactStreamingHtmlRenderOptions) {
    this.#options = options;
  }

  /**
   * Render HTML as a stream (React, Suspense, etc)
   *
   * @param contract The HTML contract to render
   * @returns Rendered streaming HTML result
   */
  async render<Props extends Record<string, unknown>>(
    contract: HtmlContract<Props>,
  ): Promise<HttpResponse> {
    const { templates, timeout } = this.#options;
    const template = contract.success ? templates.default : templates.error;

    const pass = new PassThrough({ highWaterMark: 16_384 });

    let abort!: () => void;
    const timer = setTimeout(() => {
      abort?.();
      pass.destroy(new Error("SSR timeout"));
    }, timeout ?? 5000);

    try {
      const result = renderToPipeableStream(template(contract.data), {
        /**
         *
         */
        onShellReady() {
          clearTimeout(timer);
          pass.write("<!DOCTYPE html>");
          result.pipe(pass);
        },

        /**
         * Handle shell errors
         *
         * @param error The error occurred before shell is ready
         */
        onShellError(error) {
          throw error;
        },

        /**
         * Handle errors
         *
         * @param error The error occured
         */
        onError(error) {
          throw error;
        },
      });

      abort = result.abort;

      const stream = Readable.toWeb(pass) as ReadableStream<Uint8Array>;

      return {
        intent: "html",
        status: contract.http?.status ?? (contract.success ? 200 : 500),
        stream,
        abort,
        ...(contract.http?.headers && { headers: contract.http.headers }),
      };
    } catch (error) {
      clearTimeout(timer);
      pass.destroy(error as Error);

      throw error;
    }
  }
}
