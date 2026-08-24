import type { Instant } from "@comity/primitives/time";
import type { OrderContact } from "./contact.js";

/**
 * Immutable historical fact about the buyer of an order.
 *
 * A plain, owned representation of the customer as it was at purchase time.
 * It is NOT `Customer` from `@comity/customer` and it is not a reference to
 * the customer module: once the order is created it MUST NOT depend on the
 * customer for its content. Historical order rendering, customer support, and
 * invoice generation rely exclusively on this record.
 *
 * Only identity and display facts are preserved. Operational customer state
 * (preferences, lifecycle metadata) is not copied.
 */
export interface OrderCustomerSnapshot {
  /** Reference to the customer identifier, if still known. */
  readonly customerId?: string;

  /** Display name of the buyer. */
  readonly displayName: string;

  /** Buyer contact channels, e.g. email or phone. */
  readonly contacts?: ReadonlyArray<OrderContact>;

  /** The timestamp when the customer fact was captured. */
  readonly capturedAt: Instant;
}
