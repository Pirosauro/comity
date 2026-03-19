import type { ResultSuccess } from "@comity/primitives/result";
import type { HtmlContract } from "../types/html.js";
import type { CategoryViewModel } from "../view-models/category.js";

/**
 * Presents a HelloViewModel from a use case result
 *
 * @param result Use case result
 *
 * @returns HelloViewModel
 */
export function presentCategory(
  result: ResultSuccess<CategoryViewModel>
): HtmlContract<CategoryViewModel> {
  const locale = {
    locale: "en-US",
    direction: "ltr",
  } as const;
  const { meta, ...data } = result.value;

  return {
    data,
    meta,
    http: {
      status: 200,
    },
    locale,
  };
}
