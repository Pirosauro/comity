/**
 * Product inventory status.
 */
export interface InventoryModel {
  /** In-stock status. */
  readonly status: "in_stock" | "out_of_stock" | "preorder";

  /** Available quantity. */
  readonly quantity?: number;

  /** Low stock threshold (show warning if below). */
  readonly lowStockThreshold?: number;
}
