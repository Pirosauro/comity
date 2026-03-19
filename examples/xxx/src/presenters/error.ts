import type { HttpStatus } from "@comity/http";
import type { BaseError, ErrorMeta } from "@comity/primitives/error";
import type { HtmlContract } from "../types/html.js";
import type { ErrorViewModel } from "../view-models/error.js";

/**
 * Presents an error as an ErrorViewModel
 *
 * @param error Error instance
 *
 * @returns Error view model
 */
export function presentError(error: BaseError): HtmlContract<ErrorViewModel> {
  const status = ((error.meta as ErrorMeta).httpStatus ?? 500) as HttpStatus;
  const locale = {
    locale: "en-US",
    direction: "ltr",
  } as const;

  return {
    data: {
      title: "Something went wrong",
      message: error.message,
    },
    http: {
      status,
    },
    locale,
  };
}
