import type { Result } from "@comity/primitives/result";
import type { CustomerId } from "../value-objects/customer-id.js";
import type { ClassificationContext } from "./classification-context.js";

import { success } from "@comity/primitives/result";

/**
 * Core contract for retrieving a customer's group memberships.
 *
 * Customer groups are explicitly managed classifications (e.g., "vip", "wholesale",
 * "b2b"). The Application owns the assignment logic and persistence.
 */
export interface CustomerGroupRegistry {
  /**
   * Retrieves the group identifiers for a customer.
   *
   * @param customerId - The customer identifier.
   *
   * @returns The group identifiers, or an empty array if none assigned.
   */
  getGroups(customerId: CustomerId): Promise<Result<readonly string[], never>>;
}

/**
 * Core contract for evaluating a customer's segment memberships.
 *
 * Customer segments are dynamically derived classifications (e.g., "high-value",
 * "at-risk", "frequent-buyer") evaluated by Application-specific rules.
 * The Application owns the evaluation logic.
 */
export interface CustomerSegmentEvaluator {
  /**
   * Evaluates the segment memberships for a customer in a given context.
   *
   * @param customerId - The customer identifier.
   * @param context - The classification context for evaluation.
   *
   * @returns The segment identifiers, or an empty array if none match.
   */
  evaluate(
    customerId: CustomerId,
    context: ClassificationContext
  ): Promise<Result<readonly string[], never>>;
}

/**
 * No-op implementation of {@link CustomerGroupRegistry} that returns no groups.
 *
 * Useful as a default when no group management is configured.
 */
export class NoOpCustomerGroupRegistry implements CustomerGroupRegistry {
  async getGroups(_customerId: CustomerId): Promise<Result<readonly string[], never>> {
    return success([]);
  }
}

/**
 * No-op implementation of {@link CustomerSegmentEvaluator} that returns no segments.
 *
 * Useful as a default when no segment evaluation is configured.
 */
export class NoOpCustomerSegmentEvaluator implements CustomerSegmentEvaluator {
  async evaluate(
    _customerId: CustomerId,
    _context: ClassificationContext
  ): Promise<Result<readonly string[], never>> {
    return success([]);
  }
}
