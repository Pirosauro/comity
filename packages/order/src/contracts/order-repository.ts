import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";

import type { OrderModel } from "./order.js";

/**
 * Order repository contract.
 *
 * @remarks
 * This contract is the persistence boundary only. Domain operations such as
 * adding items, applying coupons, and clearing the order live on
 * `OrderCommands`.
 *
 * @remarks Open question: future read operations may include {@link list} for
 * order history.
 */
export interface OrderRepository {
  /**
   * Retrieve an order by identifier.
   *
   * @param id - Order ID.
   *
   * @returns Order model or null if not found.
   */
  get(id: string): Promise<Result<OrderModel | null, RepositoryError>>;

  /**
   * Persist an order.
   *
   * @remarks
   * Implementations MUST treat this as upsert: if the order id already
   * exists the stored order is overwritten, otherwise a new order is
   * created.
   *
   * @param order - Order to persist.
   */
  save(order: OrderModel): Promise<Result<void, RepositoryError>>;
}