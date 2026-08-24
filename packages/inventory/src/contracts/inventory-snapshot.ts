import type { Quantity } from "../value-objects/quantity.js";
import type { Sku } from "../value-objects/sku.js";
import type { WarehouseId } from "../value-objects/warehouse-id.js";

/**
 * Immutable point-in-time inventory fact for a single SKU in a single
 * warehouse.
 *
 * This snapshot exists so other modules (e.g. `@comity/order`) can persist
 * the inventory state that was valid when a business event happened. It
 * carries a quantity value only — never a live Stock, a reservation, or
 * availability logic.
 */
export interface InventorySnapshot {
  /** The stock-keeping unit. */
  readonly sku: Sku;

  /** The warehouse the inventory belongs to. */
  readonly warehouseId: WarehouseId;

  /** The quantity at the time of capture. */
  readonly quantity: Quantity;
}