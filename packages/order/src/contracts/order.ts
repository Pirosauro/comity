import type { Price } from "@comity/pricing";
import type { Instant } from "@comity/primitives/time";
import type { OrderId } from "../value-objects/order-id.js";
import type { OrderAddressSnapshot } from "./address-snapshot.js";
import type { OrderCustomerSnapshot } from "./customer-snapshot.js";
import type { OrderItem, OrderProductSnapshot } from "./item.js";
import type { OrderPaymentSnapshot } from "./payment-snapshot.js";

/**
 * Order status.
 *
 * An order starts in {@link OrderStatus."draft"} and progresses through a linear lifecycle.
 * Each transition is explicit; the status cannot move backwards.
 *
 * Transitions:
 * - `draft` → `pending` (submit)
 * - `pending` → `confirmed` (confirm)
 * - `confirmed` → `fulfilled` (fulfill)
 * - `draft | pending | confirmed` → `cancelled` (cancel)
 *
 * `fulfilled` and `cancelled` are terminal.
 */
export type OrderStatus = "draft" | "pending" | "confirmed" | "fulfilled" | "cancelled";

/**
 * Business data of an order, independent of identity and lifecycle metadata.
 */
export interface OrderData {
  /** Order items. */
  readonly items: ReadonlyArray<OrderItem>;

  /** Order price. `@comity/pricing` owns price composition: modifiers are accessed through `price.modifiers`. */
  readonly price: Price;

  /** Historical buyer fact, captured at purchase time. */
  readonly customer?: OrderCustomerSnapshot;

  /** Historical address facts (shipping/billing), captured at purchase time. */
  readonly addresses?: ReadonlyArray<OrderAddressSnapshot>;

  /** Historical payment facts, attached after processing. */
  readonly payments?: ReadonlyArray<OrderPaymentSnapshot>;

  /** Custom metadata. */
  readonly meta?: Record<string, unknown>;
}

/**
 * The persistent state of an existing order.
 */
export interface OrderState extends OrderData {
  /** Unique order identifier. */
  readonly id: OrderId;

  /** Order lifecycle status. */
  readonly status: OrderStatus;

  /** Creation timestamp. */
  readonly createdAt: Instant;

  /** Last update timestamp. */
  readonly updatedAt: Instant;
}

/**
 * Immutable point-in-time snapshot of an existing order.
 */
export type OrderSnapshot = Readonly<
  OrderState & {
    /** The timestamp when the snapshot was captured. */
    readonly capturedAt: Instant;
  }
>;

/**
 * Data required to create a new order.
 *
 * The identifier and the initial status are managed by the entity: an order
 * without a supplied status starts as {@link OrderStatus."draft"}. Lifecycle
 * timestamps are optional so the same contract supports both creation and
 * hydration from persisted state (ADR-001).
 */
export type OrderCreate = OrderData & {
  /** Order lifecycle status, used to restore persisted state during hydration. */
  readonly status?: OrderStatus;

  /** The timestamp when the order was created. */
  readonly createdAt?: Instant;

  /** The timestamp when the order was last updated. */
  readonly updatedAt?: Instant;
};

/**
 * Partial mutation data for an order.
 *
 * Status transitions are not part of the update contract: they must pass
 * through the entity's domain methods (`submit`, `confirm`, `fulfill`,
 * `cancel`). Items are mutated through `addItem`/`removeItem`/
 * `updateItemQuantity`, which protect the order's invariants.
 */
export interface OrderUpdate {
  /** Order price. Modifiers are updated through `price`; see `@comity/pricing`. */
  readonly price?: Price;

  /** Custom metadata. */
  readonly meta?: Record<string, unknown>;
}

/**
 * Input for adding an item to the order.
 *
 * The item price is supplied by the caller as a complete `Price` value:
 * price computation belongs to `@comity/pricing` orchestration, not to the
 * Order aggregate. The product data is an owned snapshot mapped by the caller
 * from `ProductProjection`: the Order never depends on `@comity/catalog`.
 */
export interface OrderItemInput {
  /** Product snapshot to add to the order. */
  readonly product: OrderProductSnapshot;

  /** Quantity to add. */
  readonly quantity: number;

  /** Full line price (subtotal, applied modifiers, total). */
  readonly price: Price;
}
