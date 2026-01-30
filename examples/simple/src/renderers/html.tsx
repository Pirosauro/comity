import { ReactStreamingHtmlRenderer } from "@comity/html-react/streaming";
import { HtmlRenderPipeline } from "@comity/html-runtime";
import { DefaultLayout } from "../themes/default/layout.js";
import { ErrorView } from "../views/error.js";
import { HelloView } from "../views/hello.js";

export const htmlRenderer = new HtmlRenderPipeline([
  new ReactStreamingHtmlRenderer({
    templates: {
      default: (data) => (
        <DefaultLayout title="OK">
          <HelloView {...data} />
        </DefaultLayout>
      ),
      error: (data) => (
        <DefaultLayout title="ERROR">
          <ErrorView {...data} />
        </DefaultLayout>
      ),
    },
  }),

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
]);
