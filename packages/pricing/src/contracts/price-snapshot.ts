import type { Instant } from "@comity/primitives/time";
import type { Price } from "../value-objects/price.js";

/**
 * A price frozen in time.
 *
 * A {@link Price} snapshot extends the price value itself with the instant it
 * was captured. Used for order snapshots, history, and immutable persistence.
 * Pricing computes values; it does not project data — the snapshot shape
 * simply records a computed result at a given instant.
 */
export type PriceSnapshot = Price &
  Readonly<{
    /** The instant the price was captured. */
    capturedAt: Instant;
  }>;
