import type { ResultSuccess } from "@comity/primitives/result";
import type { HtmlContract } from "../types/html.js";
import type { HelloViewModel } from "../view-models/hello.js";

/**
 * Presents a HelloViewModel from a use case result
 *
 * @param result Use case result
 *
 * @returns HelloViewModel
 */
export function presentHello(result: ResultSuccess<HelloViewModel>): HtmlContract<HelloViewModel> {
  const locale = {
    locale: "en-US",
    direction: "ltr",
  } as const;

  return {
    data: {
      title: result.value.title,
      message: result.value.message,
    },
    http: {
      status: 200,
    },
    locale,
  };
}
