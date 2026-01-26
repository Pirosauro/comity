import type { HtmlContract } from "@comity/http";
import type { BaseError, ErrorMeta } from "@comity/primitives/errors";
import type { ErrorViewModel } from "../view-models/error.js";

/**
 * Presents an error as an ErrorViewModel
 *
 * @param error Error instance
 * @returns Error view model
 */
export function presentError(error: BaseError): HtmlContract<ErrorViewModel> {
  const status = (error.meta as ErrorMeta).httpStatus ?? 500;
  const locale = {
    locale: "en-US",
    direction: "ltr",
  } as const;

  return {
    success: false,
    data: {
      title: "Something went wrong",
      message: error.message,
      status,
    },
    http: {
      status: 500,
    },
    locale,
  };
}
