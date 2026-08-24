import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for purchase eligibility errors.
 *
 * @remarks
 * Initial MVP reason set. Additional reasons may be added as additive
 * changes per `errors.md` §10.
 */
export type PurchaseErrorReason = "not_purchasable";

/**
 * Metadata attached to purchase errors.
 */
export interface PurchaseErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: PurchaseErrorReason;

  /** Optional diagnostic details. */
  readonly details?: Readonly<{
    /** Product identifier that failed eligibility. */
    productId?: string;

    /** Product status at evaluation time. */
    status?: string;

    /** Context fields at evaluation time. */
    context?: Readonly<{
      /** Country code from evaluation context. */
      countryCode?: string;

      /** Currency from evaluation context. */
      currency?: string;

      /** Channel from evaluation context. */
      channel?: string;
    }>;
  }>;
}

/**
 * Human-friendly messages mapped by reason.
 */
const REASON_MESSAGES: Record<PurchaseErrorReason, string> = {
  not_purchasable: "Product cannot be purchased in the current context",
};

/**
 * Default HTTP status mapped by reason.
 */
const REASON_HTTP_STATUS: Record<PurchaseErrorReason, number> = {
  not_purchasable: 409,
};

/**
 * Purchase eligibility error.
 *
 * Represents a commercial eligibility failure — not a catalog, order,
 * or pricing domain error. This is an Application-level error.
 */
export class PurchaseError extends BaseError<PurchaseErrorMeta> {
  /** Namespaced error code. */
  readonly code: `purchase:${PurchaseErrorReason}`;

  /**
   * @param reason - The reason for the purchase error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: PurchaseErrorReason, meta?: Omit<PurchaseErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `purchase:${reason}`;
  }
}