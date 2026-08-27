import type { RepositoryError } from "@comity/primitives/errors";
import type { Result } from "@comity/primitives/result";
import type { TenantId } from "@comity/organization";
import type { Order } from "../entities/order.js";
import type { OrderId } from "../value-objects/order-id.js";
import type { OrderState, OrderStatus } from "./order.js";

/**
 * Minimal search/filter criteria for orders.
 */
export interface OrderSearchCriteria {
  /** Filter orders by lifecycle status. */
  readonly status?: OrderStatus | undefined;

  /** The maximum number of results to return. */
  readonly limit?: number | undefined;

  /** The offset for paginated results. */
  readonly offset?: number | undefined;
}

/**
 * Result of listing or searching orders.
 */
export interface OrderSearchResult {
  /** The matching orders. */
  readonly items: ReadonlyArray<OrderState>;

  /** Total number of matching orders. */
  readonly total: number;
}

/**
 * Context for order repository operations.
 *
 * The tenant provides the isolation boundary for the operation.
 * It is not stored on the order itself — tenant is an operational
 * context, not a business fact of the order.
 */
export interface OrderRepositoryContext {
  /** The tenant identifier for isolation. */
  readonly tenant: TenantId;
}

/**
 * Order repository contract.
 *
 * @remarks
 * This contract is the persistence boundary only. Domain behavior (status
 * transitions, item mutations) lives on the `Order` entity; orchestration
 * belongs to application/domain services.
 *
 * @remarks
 * Not found is `null`, never an error. Orders are not physically deleted: the
 * terminal lifecycle states are `cancelled` and `fulfilled`, so no `remove`
 * operation is exposed.
 */
export interface OrderRepository {
  /**
   * Retrieve an order by identifier.
   *
   * @param id - Order ID.
   * @param ctx - Repository context containing tenant for isolation.
   *
   * @returns Order entity or null if not found.
   */
  getById(id: OrderId, ctx: OrderRepositoryContext): Promise<Result<Order | null, RepositoryError>>;

  /**
   * Persist an order.
   *
   * @param order - Order to persist.
   * @param ctx - Repository context containing tenant for isolation.
   *
   * @remarks
   * Implementations MUST treat this as upsert: if the order id already
   * exists the stored order is overwritten, otherwise a new order is
   * created.
   */
  save(order: Order, ctx: OrderRepositoryContext): Promise<Result<void, RepositoryError>>;

  /**
   * Search orders matching the given criteria.
   *
   * @param criteria - Search criteria.
   * @param ctx - Repository context containing tenant for isolation.
   *
   * @returns Matching orders with a total count.
   */
  search(criteria: OrderSearchCriteria | undefined, ctx: OrderRepositoryContext): Promise<Result<OrderSearchResult, RepositoryError>>;
}
