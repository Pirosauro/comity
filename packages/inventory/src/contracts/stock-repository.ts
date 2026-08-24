import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { Stock } from "../entities/stock.js";
import type { Quantity } from "../value-objects/quantity.js";
import type { Sku } from "../value-objects/sku.js";
import type { StockId } from "../value-objects/stock-id.js";
import type { WarehouseId } from "../value-objects/warehouse-id.js";

/**
 * Minimal structural search/filter criteria for stock records.
 *
 * The criteria are deliberately structural: they filter on SKU, warehouse,
 * and a minimum available quantity. Business policies (discontinued products,
 * clearance, preorders, order fulfilment) are NOT modeled here.
 */
export interface StockSearchCriteria {
  /** Filter stock records by SKU. */
  readonly sku?: Sku | undefined;

  /** Filter stock records by warehouse. */
  readonly warehouseId?: WarehouseId | undefined;

  /** Only include stock records with at least this much available quantity. */
  readonly availableAtLeast?: Quantity | undefined;
}

/**
 * Result of listing or searching stock records.
 */
export interface StockSearchResult {
  /** The matching stock records. */
  readonly items: ReadonlyArray<Stock>;

  /** Total number of matching stock records. */
  readonly total: number;
}

/**
 * Stock repository contract.
 *
 * @remarks
 * This contract is the persistence boundary only. Domain behavior (stock
 * mutations, availability) lives on the `Stock` entity; orchestration belongs
 * to application/domain services.
 *
 * @remarks
 * Not found is `null`, never an error. Stock records are not physically
 * deleted, so no `remove` operation is exposed.
 */
export interface StockRepository {
  /**
   * Retrieve a stock record by identifier.
   *
   * @param id - Stock ID.
   *
   * @returns Stock entity or null if not found.
   */
  getById(id: StockId): Promise<Result<Stock | null, RepositoryError>>;

  /**
   * Persist a stock record.
   *
   * @param stock - Stock record to persist.
   *
   * @remarks
   * Implementations MUST treat this as upsert: if the stock id already exists
   * the stored record is overwritten, otherwise a new record is created.
   */
  save(stock: Stock): Promise<Result<void, RepositoryError>>;

  /**
   * Search stock records matching the given criteria.
   *
   * @param criteria - Search criteria.
   *
   * @returns Matching stock records with a total count.
   */
  search(criteria?: StockSearchCriteria): Promise<Result<StockSearchResult, RepositoryError>>;
}