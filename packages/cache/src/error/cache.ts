import type { ErrorMeta } from "@comity/primitives/error";

import { BaseError } from "@comity/primitives/error";

/**
 *
 */
export type CacheErrorReason = "missing_store" | "get_failed" | "set_failed" | "delete_failed";

/**
 *
 */
export interface CacheErrorMeta extends ErrorMeta {
  /**
   *
   */
  reason: CacheErrorReason;

  /**
   *
   */
  details?: Readonly<{
    /**
     *
     */
    key?: string;
    /**
     *
     */
    namespace?: string;
  }>;
}

const REASON_MESSAGES: Record<CacheErrorReason, string> = {
  missing_store: "No cache store configured",
  get_failed: "Cache get failed",
  set_failed: "Cache set failed",
  delete_failed: "Cache delete failed",
};

/**
 * Cache module errors.
 */
export class CacheError extends BaseError<CacheErrorMeta> {
  readonly code: `cache:${CacheErrorReason}`;

  constructor(reason: CacheErrorReason, meta?: Omit<CacheErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `cache:${reason}`;
  }
}
