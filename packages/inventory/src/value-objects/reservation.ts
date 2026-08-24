import type { Quantity } from "./quantity.js";
import type { Sku } from "./sku.js";
import type { WarehouseId } from "./warehouse-id.js";

/**
 * Reservation is a value object representing a quantity of stock that is
 * currently reserved.
 *
 * It has no lifecycle and no states: a reservation exists or it does not.
 * When the reservation is released, the reserved quantity becomes available
 * again. Releasing happens on the owning Stock; this object is the record of
 * what was reserved — persisting it, when needed, is the responsibility of
 * the orchestrating layer (e.g. checkout), not of `@comity/inventory`.
 */
export class Reservation {
  #sku: Sku;
  #warehouseId: WarehouseId;
  #quantity: Quantity;

  /**
   * Creates a Reservation for a SKU in a warehouse.
   *
   * All inputs are already validated Value Objects, so there is no failure
   * mode: this factory always succeeds.
   *
   * @param sku - The reserved SKU.
   * @param warehouseId - The warehouse the reservation applies to.
   * @param quantity - The reserved quantity.
   *
   * @returns The Reservation.
   */
  static create(sku: Sku, warehouseId: WarehouseId, quantity: Quantity): Reservation {
    return new Reservation(sku, warehouseId, quantity);
  }

  /**
   * @param sku - The reserved SKU.
   * @param warehouseId - The warehouse the reservation applies to.
   * @param quantity - The reserved quantity.
   */
  private constructor(sku: Sku, warehouseId: WarehouseId, quantity: Quantity) {
    this.#sku = sku;
    this.#warehouseId = warehouseId;
    this.#quantity = quantity;
  }

  /**
   * Returns the reserved SKU.
   *
   * @returns The SKU.
   */
  get sku(): Sku {
    return this.#sku;
  }

  /**
   * Returns the warehouse the reservation applies to.
   *
   * @returns The warehouse ID.
   */
  get warehouseId(): WarehouseId {
    return this.#warehouseId;
  }

  /**
   * Returns the reserved quantity.
   *
   * @returns The quantity.
   */
  get quantity(): Quantity {
    return this.#quantity;
  }

  /**
   * Checks if this Reservation is equal to another Reservation.
   *
   * @param other - The other Reservation to compare with.
   *
   * @returns True if the SKU, warehouse, and quantity are equal, false
   * otherwise.
   */
  equals(other: Reservation): boolean {
    return (
      this.#sku.equals(other.sku) &&
      this.#warehouseId.equals(other.warehouseId) &&
      this.#quantity.equals(other.quantity)
    );
  }

  /**
   * Returns a stable technical serialization of the reservation.
   *
   * This is a technical representation, NEVER a display format.
   *
   * @returns The string representation.
   */
  toString(): string {
    return `${this.#warehouseId.toString()}:${this.#sku.toString()} ${this.#quantity.toString()}`;
  }
}