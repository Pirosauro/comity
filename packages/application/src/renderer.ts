import type { HtmlLayoutCollector, HtmlRenderer } from "@comity/html";
import type { HttpResponse } from "@comity/http";
import type { ApplicationContract } from "./contracts/application.js";
import type { ApplicationResolver } from "./contracts/resolver.js";

import { resolveContract } from "./internal/resolve-contract.js";

/**
 * Renders the given HTTP contract using the provided resolvers and renderer.
 *
 * @param contract - The HTTP contract to render.
 * @param resolvers - An array of application resolvers to apply to the contract before rendering.
 * @param renderer - The application renderer to use for rendering the contract's view.
 * @param collector - The HTML layout collector to gather layout information during rendering.
 *
 * @returns A promise that resolves to the rendered result, which includes the HTTP status, headers, and body.
 */
export async function renderApplication<T = unknown>(
  contract: ApplicationContract<T>,
  resolvers: ApplicationResolver[],
  renderer: HtmlRenderer<T>,
  collector: HtmlLayoutCollector
): Promise<HttpResponse> {
  const resolved = await resolveContract(contract, resolvers);
  const status = resolved.http?.status ?? 200;
  const headers = resolved.http?.headers ?? {};
  const view = resolved.view as T;

  if (!view) {
    return {
      status: 500,
      body: "No view",
    };
  }

  const result = await renderer.render(view, collector, {
    status,
    headers,
  });

  if (result.ok) {
    return result.value;
  }

  return {
    status: 500,
    body: "Render failed",
  };
}
