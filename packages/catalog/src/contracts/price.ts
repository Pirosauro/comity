/**
 * Price-related contracts for the shopping cart.
 */
export interface PriceModifierModel {
  /** Modifier code */
  readonly code: string;

  /** Human readable label */
  readonly label?: string;

  /** Modifier amount */
  readonly amount: number;

  /** Modifier category */
  readonly kind: "discount" | "tax" | "shipping" | "fee" | "credit" | "other";
}

/**
 * Pricing information for a shopping cart.
 */
export interface PriceModel {
  /** ISO 4217 currency code (e.g., "USD", "EUR"). */
  readonly currency: string;

  /** Subtotal before discounts and tax. */
  readonly subtotal: number;

  /** Price modifiers (e.g., discounts, taxes, shipping). */
  readonly modifiers?: ReadonlyArray<PriceModifierModel>;

  /** Total amount due. */
  readonly total: number;
}
