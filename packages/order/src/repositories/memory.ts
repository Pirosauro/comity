import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { TenantId } from "@comity/organization";
import type {
  OrderRepository,
  OrderRepositoryContext,
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
  /** Internal storage keyed by tenant + order ID */
  #orders = new Map<string, Order>();

  #makeKey(tenant: TenantId, id: OrderId): string {
    return `${tenant.toString()}\u0000${id.toString()}`;
  }

  /**
   * @inheritdoc
   */
  async getById(id: OrderId, ctx: OrderRepositoryContext): Promise<Result<Order | null, RepositoryError>> {
    const order = this.#orders.get(this.#makeKey(ctx.tenant, id));

    if (!order) {
      return success(null);
    }

    return success(order);
  }

  /**
   * @inheritdoc
   */
  async save(order: Order, ctx: OrderRepositoryContext): Promise<Result<void, RepositoryError>> {
    this.#orders.set(this.#makeKey(ctx.tenant, order.id!), order);

    return success(undefined);
  }

  /**
   * @inheritdoc
   */
  async search(
    criteria: OrderSearchCriteria | undefined,
    ctx: OrderRepositoryContext
  ): Promise<Result<OrderSearchResult, RepositoryError>> {
    const tenantPrefix = `${ctx.tenant.toString()}\u0000`;
    const all = [...this.#orders.entries()]
      .filter(([key]) => key.startsWith(tenantPrefix))
      .map(([, order]) => order);
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
      channelId: o.channelId,
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
