import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Catalog error reason.
 */
export type CatalogErrorReason = "invalid_product" | "invalid_status_transition";

/**
 * Catalog error metadata.
 */
interface CatalogErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: CatalogErrorReason;

  /** Contextual details. */
  readonly details?: Readonly<{
    /** Affected product ID. */
    productId?: string;

    /** Invalid input field. */
    field?: string;

    /** Source status of an invalid transition. */
    from?: string;

    /** Target status of an invalid transition. */
    to?: string;
  }>;
}

const REASON_MESSAGES: Record<CatalogErrorReason, string> = {
  invalid_product: "Invalid product",
  invalid_status_transition: "Invalid product status transition",
};

const REASON_HTTP_STATUS: Record<CatalogErrorReason, number> = {
  invalid_product: 400,
  invalid_status_transition: 409,
};

/**
 * Catalog operation error with typed reasons.
 */
export class CatalogError extends BaseError<CatalogErrorMeta> {
  /** Error code. */
  readonly code: `catalog:${CatalogErrorReason}`;

  /**
   * @param reason - The reason for the catalog error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: CatalogErrorReason, meta?: Omit<CatalogErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `catalog:${reason}`;
  }
}