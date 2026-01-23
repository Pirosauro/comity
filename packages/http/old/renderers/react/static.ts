import type { HtmlContract } from "../../contracts/html.js";
import type { HttpResponse } from "../../contracts/response.js";
import type { StaticHtmlRenderer } from "../static.js";
import type { ReactStaticHtmlRenderOptions } from "./types.js";

import { renderToString } from "react-dom/server";

/**
 * Static HTML renderer for React templates
 */
export class ReactStaticHtmlRenderer implements StaticHtmlRenderer {
  /** Options for rendering */
  #options: ReactStaticHtmlRenderOptions;

  /**
   * @param options Options for rendering
   */
  constructor(options: ReactStaticHtmlRenderOptions) {
    this.#options = options;
  }

  /**
   * Render static HTML (React)
   *
   * @param contract The HTML contract to render
   * @returns Rendered static HTML result
   */
  async render<Props extends Record<string, unknown>>(
    contract: HtmlContract<Props>,
  ): Promise<HttpResponse> {
    const template = contract.success
      ? this.#options.templates.default
      : this.#options.templates.error;

    try {
      // Render the React element to a string
      const html = renderToString(template(contract.data));

      return {
        intent: "html",
        status: contract.http?.status ?? (contract.success ? 200 : 500),
        body: "<!DOCTYPE html>" + html,
        ...(contract.http?.headers && { headers: contract.http.headers }),
      };
    } catch (error) {
      throw error;
    }
  }
}
