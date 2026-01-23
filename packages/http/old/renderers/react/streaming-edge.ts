import type { HtmlContract } from "../../contracts/html.js";
import type { HttpResponse } from "../../contracts/response.js";
import type { StreamingHtmlRenderer } from "../streaming.js";
import type { ReactStreamingHtmlRenderOptions } from "./types.js";

import { renderToReadableStream } from "react-dom/server";

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
    const { templates, timeout = 5000, onError } = this.#options;
    const template = contract.success ? templates.default : templates.error;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const stream = await renderToReadableStream(template(contract.data), {
        signal: controller.signal,
      });

      return {
        intent: "html",
        status: contract.http?.status ?? (contract.success ? 200 : 500),
        stream,
        abort: controller.abort.bind(controller),
        ...(contract.http?.headers && { headers: contract.http.headers }),
      };
    } catch (error) {
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}
