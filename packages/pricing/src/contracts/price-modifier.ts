import type { Money } from "../value-objects/money.js";
import type { Percentage } from "../value-objects/percentage.js";

/**
 * Price modifier category.
 *
 * Descriptive metadata: pricing never interprets the kind to decide how an
 * adjustment is applied. The arithmetic semantics live in
 * {@link PriceAdjustment.operation}.
 */
export type PriceModifierKind = "discount" | "charge" | "credit" | "tax" | "other";

/**
 * Mathematical operation of an adjustment.
 *
 * `add` increases the running total, `subtract` decreases it. This is pure
 * arithmetic — it carries no business meaning about what the modifier is.
 */
export type AdjustmentOperation = "add" | "subtract";

/**
 * The mathematical adjustment of a price modifier.
 *
 * `money` carries an exact monetary amount; `percentage` carries a real
 * {@link Percentage} rate (e.g. `10`% — not a factor). The discriminated
 * union makes it impossible to express a `money` adjustment without an amount
 * or a `percentage` adjustment without a rate; the `operation` provides the
 * sign, keeping `Money` non-negative and `Percentage` a real percentage.
 *
 * Pricing interprets ONLY this type and operation — never the modifier's
 * `kind` or `component`.
 */
export type PriceAdjustment =
  | {
      /** Absolute adjustment type. */
      readonly type: "money";

      /** Exact monetary adjustment. */
      readonly amount: Money;

      /** Whether the amount is added to or subtracted from the total. */
      readonly operation: AdjustmentOperation;
    }
  | {
      /** Percentage adjustment type. */
      readonly type: "percentage";

      /** Adjustment rate (e.g. `10`%, `7.25`%). */
      readonly rate: Percentage;

      /** Whether the rate is added to or subtracted from the total. */
      readonly operation: AdjustmentOperation;
    };

/**
 * Serializable descriptor of a commercial price adjustment.
 *
 * A modifier describes the commercial context (`code`, `label`, `kind`,
 * `component`) and carries a mathematical {@link PriceAdjustment}. It is
 * data, not behavior: the application of an adjustment is performed by
 * {@link calculatePrice} (through {@link Price.create}), never by the
 * modifier itself.
 *
 * `component` is an optional semantic label (e.g. `shipping`, `handling`,
 * `payment`, `insurance`) that pricing does NOT interpret.
 *
 * Modifiers are applied in the order they appear in the input array. Pricing
 * never reorders them: application order is fully controlled by the consumer.
 */
export interface PriceModifier {
  /** Modifier code. */
  readonly code: string;

  /** Human-readable label. */
  readonly label?: string;

  /** Modifier category (descriptive, never interpreted by pricing). */
  readonly kind: PriceModifierKind;

  /** Optional semantic component (descriptive, never interpreted by pricing). */
  readonly component?: string;

  /** The mathematical adjustment to apply. */
  readonly adjustment: PriceAdjustment;
}
