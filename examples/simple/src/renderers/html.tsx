import type { ErrorViewModel } from "../view-models/error.js";
import type { HelloViewModel } from "../view-models/hello.js";

import { HtmlRendererOrchestrator } from "@comity/http/renderers";
import {
  ReactStaticHtmlRenderer,
  ReactStreamingHtmlRenderer,
} from "@comity/http/renderers/react";
import { DefaultLayout } from "../themes/default/layout.js";
import { ErrorView } from "../views/error.js";
import { HelloView } from "../views/hello.js";

export const htmlRenderer = new HtmlRendererOrchestrator([
  new ReactStreamingHtmlRenderer({
    templates: {
      default: (data) => (
        <DefaultLayout title={"OK"}>
          <HelloView {...(data as HelloViewModel)} />
        </DefaultLayout>
      ),
      error: (data) => (
        <DefaultLayout title={"ERROR"}>
          <ErrorView {...(data as ErrorViewModel)} />
        </DefaultLayout>
      ),
    },
  }),
  // fallback static
  new ReactStaticHtmlRenderer({
    templates: {
      default: (data) => (
        <DefaultLayout title={"OK"}>
          <HelloView {...(data as HelloViewModel)} />
        </DefaultLayout>
      ),
      error: (data) => (
        <DefaultLayout title={"ERROR"}>
          <ErrorView {...(data as ErrorViewModel)} />
        </DefaultLayout>
      ),
    },
  }),
]);
