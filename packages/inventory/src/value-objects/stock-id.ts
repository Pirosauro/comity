import type { Sku } from "./sku.js";
import type { WarehouseId } from "./warehouse-id.js";

/**
 * StockId is a value object that represents the unique identifier of a Stock.
 *
 * The identity of a Stock is its `(Sku, WarehouseId)` pair: stock is always
 * scoped to exactly one warehouse. Because both parts are already-validated
 * Value Objects, `create` cannot fail and returns a `StockId` directly rather
 * than a `Result`.
 */
export class StockId {
  #sku: Sku;
  #warehouseId: WarehouseId;

  /**
   * Creates a StockId from a SKU and a warehouse ID.
   *
   * Both inputs are already validated Value Objects, so there is no failure
   * mode: this factory always succeeds.
   *
   * @param sku - The SKU of the stock.
   * @param warehouseId - The warehouse the stock belongs to.
   *
   * @returns The StockId.
   */
  static create(sku: Sku, warehouseId: WarehouseId): StockId {
    return new StockId(sku, warehouseId);
  }

  /**
   * @param sku - The SKU of the stock.
   * @param warehouseId - The warehouse the stock belongs to.
   */
  private constructor(sku: Sku, warehouseId: WarehouseId) {
    this.#sku = sku;
    this.#warehouseId = warehouseId;
  }

  /**
   * Returns the SKU of the stock.
   *
   * @returns The SKU.
   */
  get sku(): Sku {
    return this.#sku;
  }

  /**
   * Returns the warehouse the stock belongs to.
   *
   * @returns The warehouse ID.
   */
  get warehouseId(): WarehouseId {
    return this.#warehouseId;
  }

  /**
   * Checks if this StockId is equal to another StockId.
   *
   * @param other - The other StockId to compare with.
   *
   * @returns True if the StockIds are equal, false otherwise.
   */
  equals(other: StockId): boolean {
    return this.#sku.equals(other.sku) && this.#warehouseId.equals(other.warehouseId);
  }

  /**
   * Returns a string representation of the stock ID.
   *
   * @returns The string representation of the stock ID.
   */
  toString(): string {
    return `${this.#warehouseId.toString()}:${this.#sku.toString()}`;
  }
}