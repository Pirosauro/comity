import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 *
 */
export interface HtmlRenderFailureErrorMeta extends ErrorMeta {
  /**
   *
   */
  reason: "no-renderer-available" | string;
}

/**
 *
 */
export class HtmlRenderFailureError extends BaseError {
  readonly code = "html:render_failure";

  constructor(meta: HtmlRenderFailureErrorMeta) {
    super("Failed to render HTML view", { httpStatus: 500, ...meta });
  }
}
