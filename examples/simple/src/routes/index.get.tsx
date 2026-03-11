import type { Route } from "@comity/router";
import { presentError } from "../presenters/error.js";
import { presentHello } from "../presenters/hello.js";
import { renderHtml } from "../renderers/html.js";
import { helloUseCase } from "../use-cases/hello.js";
import { HelloView } from "../views/hello.js";

const route: Route = {
  method: "GET",
  path: "/",
  handler: async (ctx) => {
    const result = helloUseCase();
    const contract = result.success ? presentHello(result) : presentError(result.error);
    const view = <HelloView {...contract.data} />;
    const renderResult = await renderHtml(view, {
      status: contract.http?.status ?? 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });

    if (renderResult.ok) {
      return renderResult.value;
    }

    return {
      status: 500,
      body: "Failed to render HTML view",
    };
  },
};

export default route;
