import type { Instant } from "@comity/primitives/time";
import type { Quantity } from "../value-objects/quantity.js";
import type { Sku } from "../value-objects/sku.js";
import type { StockId } from "../value-objects/stock-id.js";
import type { WarehouseId } from "../value-objects/warehouse-id.js";

/**
 * Stock amounts for a single SKU in a single warehouse.
 */
export interface StockData {
  /** The stock-keeping unit. */
  readonly sku: Sku;

  /** The warehouse the stock belongs to. */
  readonly warehouseId: WarehouseId;

  /** The total physical quantity on hand. */
  readonly onHand: Quantity;

  /** The quantity committed to active reservations. */
  readonly reserved: Quantity;
}

/**
 * The persistent state of an existing stock record.
 */
export interface StockState extends StockData {
  /** The unique identifier of the stock record. */
  readonly id: StockId;

  /** The timestamp when the stock record was created. */
  readonly createdAt: Instant;

  /** The timestamp when the stock record was last updated. */
  readonly updatedAt: Instant;
}

/**
 * Immutable point-in-time snapshot of a stock record.
 *
 * The identifier is always present: stock identity is the `(Sku, WarehouseId)`
 * pair, and both parts are mandatory on creation.
 */
export type StockSnapshot = Readonly<
  Omit<StockState, "id"> & {
    /** The unique identifier of the stock record. */
    readonly id: StockId;

    /** The timestamp when the snapshot was captured. */
    readonly capturedAt: Instant;
  }
>;

/**
 * Data required to create a new stock record.
 */
export type StockCreate = StockData & {
  /** The timestamp when the stock record was created. */
  readonly createdAt?: Instant;

  /** The timestamp when the stock record was last updated, if applicable. */
  readonly updatedAt?: Instant;
};