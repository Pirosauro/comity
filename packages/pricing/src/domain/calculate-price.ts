import type { Result } from "@comity/primitives/result";
import type { PriceModifier } from "../contracts/price-modifier.js";
import type { PricingError } from "../errors/pricing.js";
import type { Money } from "../value-objects/money.js";

import { Price } from "../value-objects/price.js";

/**
 * Calculates a price from a base amount and a set of modifiers.
 *
 * This is the pure domain entry point of the pricing engine. It delegates to
 * the controlled creation of {@link Price}: modifiers are validated, applied
 * in input order, and the total is computed internally.
 *
 * It is deterministic and pure: no I/O, no repositories, no adapters. It does
 * not know tax rules, coupon policy, orders, or catalog — it only applies the
 * mathematical adjustments (`add` / `subtract` of a money amount or a
 * percentage rate).
 *
 * @param base - The base money before modifiers.
 * @param modifiers - The modifiers to apply.
 *
 * @returns The calculated price, or a pricing error when a modifier is
 * invalid, is in a different currency, or would drive the total below zero.
 */
export function calculatePrice(
  base: Money,
  modifiers: ReadonlyArray<PriceModifier>
): Result<Price, PricingError> {
  return Price.create(base, modifiers);
}