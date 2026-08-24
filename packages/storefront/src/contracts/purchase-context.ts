import type { Currency } from "@comity/pricing";

/**
 * Context required to evaluate product purchasability.
 *
 * Contains only the minimal fields required for MVP eligibility evaluation.
 * Additional fields (customer, permissions, evaluatedAt) are explicitly deferred.
 */
export interface PurchaseContext {
  /** ISO 3166-1 alpha-2 country code — required for MVP. */
  readonly countryCode: string;

  /** Transaction currency — required for MVP. */
  readonly currency: Currency;

  /** Sales channel identifier — required for MVP (e.g., "web", "mobile", "pos"). */
  readonly channel: string;
}