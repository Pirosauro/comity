import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type {
  OrderRepository,
  OrderSearchCriteria,
  OrderSearchResult,
} from "../contracts/order-repository.js";
import type { OrderState } from "../contracts/order.js";
import type { Order } from "../entities/order.js";
import type { OrderId } from "../value-objects/order-id.js";

import { success } from "@comity/primitives/result";

/**
 * In-memory implementation of `OrderRepository` for testing and development purposes.
 *
 * Note: This implementation is not suitable for production use as it does not persist
 * sessions and is not shared across multiple instances of the application.
 */
export class MemoryOrderRepository implements OrderRepository {
  /** */
  #orders = new Map<string, Order>();

  /**
   * @inheritdoc
   */
  async getById(id: OrderId): Promise<Result<Order | null, RepositoryError>> {
    const order = this.#orders.get(id.toString());

    if (!order) {
      return success(null);
    }

    return success(order);
  }

  /**
   * @inheritdoc
   */
  async save(order: Order): Promise<Result<void, RepositoryError>> {
    this.#orders.set(order.id!.toString(), order);

    return success(undefined);
  }

  /**
   * @inheritdoc
   */
  async search(
    criteria?: OrderSearchCriteria
  ): Promise<Result<OrderSearchResult, RepositoryError>> {
    const all = [...this.#orders.values()] as Order[];
    let filtered = all;

    if (criteria?.status !== undefined) {
      filtered = filtered.filter((o) => o.status === criteria.status);
    }

    const limit = criteria?.limit ?? filtered.length;
    const offset = criteria?.offset ?? 0;
    const items = filtered.slice(offset, offset + limit).map((o): OrderState => ({
      id: o.id!,
      status: o.status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      items: o.items,
      price: o.price,
      ...(o.customer !== undefined ? { customer: o.customer } : {}),
      ...(o.addresses !== undefined ? { addresses: o.addresses } : {}),
      ...(o.payments !== undefined ? { payments: o.payments } : {}),
      ...(o.meta !== undefined ? { meta: o.meta } : {}),
    }));

    const total = filtered.length;

    return success({
      items,
      total,
    });
  }
}
