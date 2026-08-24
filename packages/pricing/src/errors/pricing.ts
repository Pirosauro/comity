import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Pricing error reason.
 *
 * Contains only pricing conditions owned by `@comity/pricing`. Not-found is
 * not a pricing condition; infrastructure and generic fallbacks
 * (`not_found`, `unknown`, `validation_failed`, `repository_error`) belong
 * to other layers or are forbidden entirely (ADR-012, ADR-014).
 */
export type PricingErrorReason =
  | "invalid_currency"
  | "invalid_amount"
  | "invalid_precision"
  | "currency_mismatch"
  | "invalid_percentage"
  | "invalid_modifier"
  | "calculation_failed";

/**
 * Pricing error metadata.
 */
interface PricingErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: PricingErrorReason;

  /** Contextual details. */
  readonly details?: Readonly<{
    /** Invalid input field. */
    field?: string;

    /** Invalid currency code. */
    currency?: string;

    /** Expected currency code. */
    expectedCurrency?: string;

    /** Modifier code that failed validation. */
    modifierCode?: string;
  }>;
}

const REASON_MESSAGES: Record<PricingErrorReason, string> = {
  invalid_currency: "Invalid ISO 4217 currency code",
  invalid_amount: "Invalid money amount",
  invalid_precision: "Amount precision is inconsistent with the currency",
  currency_mismatch: "Currency mismatch in money operation",
  invalid_percentage: "Invalid percentage",
  invalid_modifier: "Invalid price modifier",
  calculation_failed: "Price calculation failed",
};

const REASON_HTTP_STATUS: Record<PricingErrorReason, number> = {
  invalid_currency: 400,
  invalid_amount: 400,
  invalid_precision: 400,
  currency_mismatch: 400,
  invalid_percentage: 400,
  invalid_modifier: 400,
  calculation_failed: 422,
};

/**
 * Pricing operation error with typed reasons.
 */
export class PricingError extends BaseError<PricingErrorMeta> {
  /** Error code. */
  readonly code: `pricing:${PricingErrorReason}`;

  /**
   * @param reason - The reason for the pricing error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: PricingErrorReason, meta?: Omit<PricingErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `pricing:${reason}`;
  }
}
