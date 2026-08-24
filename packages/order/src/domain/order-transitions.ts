import type { Result } from "@comity/primitives/result";
import type { OrderStatus } from "../contracts/order.js";

import { failure, success } from "@comity/primitives/result";
import { OrderError } from "../errors/order.js";

/**
 * Legal transitions for each order status.
 *
 * - `draft` → `pending` (submit)
 * - `pending` → `confirmed` (confirm)
 * - `confirmed` → `fulfilled` (fulfill)
 * - `draft | pending | confirmed` → `cancelled` (cancel)
 *
 * `fulfilled` and `cancelled` are terminal: no transition is legal from them.
 */
const TRANSITIONS: Readonly<Record<OrderStatus, ReadonlyArray<OrderStatus>>> = {
  draft: ["pending", "cancelled"],
  pending: ["confirmed", "cancelled"],
  confirmed: ["fulfilled", "cancelled"],
  fulfilled: [],
  cancelled: [],
};

/**
 * Checks whether a status transition is legal.
 *
 * @param from - Source status.
 * @param to - Target status.
 *
 * @returns True if the transition is allowed, false otherwise.
 */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

/**
 * Applies a status transition.
 *
 * @param from - Source status.
 * @param to - Target status.
 *
 * @returns The target status, or an `invalid_status_transition` error when the
 * transition is not allowed.
 */
export function transitionOrderStatus(
  from: OrderStatus,
  to: OrderStatus
): Result<OrderStatus, OrderError> {
  if (!canTransition(from, to)) {
    return failure(
      new OrderError("invalid_status_transition", {
        details: { from, to },
      })
    );
  }

  return success(to);
}
