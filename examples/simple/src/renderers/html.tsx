import type { ReactElement } from "react";

import { HtmlRendererOptions, HtmlRendererPipeline } from "@comity/html";
import { ReactStaticHtmlRenderer } from "@comity/html-react";
import { ReactStreamingHtmlRenderer } from "@comity/html-react/streaming";
// import { DefaultLayout } from "../themes/default/layout.js";
// import { ErrorView } from "../views/error.js";
// import { HelloView } from "../views/hello.js";

export function renderHtml(view: ReactElement, options?: HtmlRendererOptions) {
  const htmlRenderer = new HtmlRendererPipeline([
    new ReactStreamingHtmlRenderer(), // Streaming first
    new ReactStaticHtmlRenderer(), // Fallback to static
  ]);

  return htmlRenderer.render(view, options);

  // new ReactStreamingHtmlRenderer({
  //   templates: {
  //     default: (data) => (
  //       <DefaultLayout title="OK">
  //         <HelloView {...data} />
  //       </DefaultLayout>
  //     ),
  //     error: (data) => (
  //       <DefaultLayout title="ERROR">
  //         <ErrorView {...data} />
  //       </DefaultLayout>
  //     ),
  //   },
  // }),

  // new ReactStaticRenderer({
  //   default: (data: HelloViewModel) => (
  //     <DefaultLayout title="OK">
  //       <HelloView {...data} />
  //     </DefaultLayout>
  //   ),
  //   error: (data: ErrorViewModel) => (
  //     <DefaultLayout title="ERROR">
  //       <ErrorView {...data} />
  //     </DefaultLayout>
  //   ),
  // }),
}
