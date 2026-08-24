import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Inventory error reason.
 *
 * Contains only domain conditions owned by the Stock aggregate. Not-found is
 * a `null` repository result, never an error; infrastructure and generic
 * fallbacks (`not_found`, `unknown`, `validation_failed`,
 * `repository_error`) belong to other layers or are forbidden entirely
 * (ADR-012, ADR-013).
 */
export type InventoryErrorReason = "invalid_quantity" | "insufficient_stock";

/**
 * Inventory error metadata.
 */
export interface InventoryErrorMeta extends ErrorMeta {
  /** Error reason. */
  readonly reason: InventoryErrorReason;

  /** Contextual details. */
  readonly details?: Readonly<{
    /** Invalid input field. */
    field?: string;

    /** Affected SKU. */
    sku?: string;

    /** Affected warehouse ID. */
    warehouseId?: string;
  }>;
}

const REASON_MESSAGES: Record<InventoryErrorReason, string> = {
  invalid_quantity: "Invalid quantity",
  insufficient_stock: "Insufficient stock",
};

const REASON_HTTP_STATUS: Record<InventoryErrorReason, number> = {
  invalid_quantity: 400,
  insufficient_stock: 409,
};

/**
 * Inventory operation error with typed reasons.
 */
export class InventoryError extends BaseError<InventoryErrorMeta> {
  /** Error code. */
  readonly code: `inventory:${InventoryErrorReason}`;

  /**
   * @param reason - The reason for the inventory error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: InventoryErrorReason, meta?: Omit<InventoryErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `inventory:${reason}`;
  }
}