import type { ReactElement } from "react";

import { HtmlRendererOptions, HtmlRendererPipeline } from "@comity/html";
import { ReactStaticHtmlRenderer } from "@comity/html-react";
import { ReactStreamingHtmlRenderer } from "@comity/html-react/streaming";

export function renderHtml(view: ReactElement, options?: HtmlRendererOptions) {
  const htmlRenderer = new HtmlRendererPipeline([
    new ReactStreamingHtmlRenderer(), // Streaming first
    new ReactStaticHtmlRenderer(), // Fallback to static
  ]);

  return htmlRenderer.render(view, options);
}
