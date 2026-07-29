import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for hydration errors.
 */
export type HydrationErrorReason = "not_registered" | "invalid_component" | "timeout";

/**
 * Metadata for hydration errors
 */
export interface HydrationErrorMeta extends ErrorMeta {
  /** Reason for the error */
  readonly reason: HydrationErrorReason;

  /** Additional details about the error */
  readonly details?: Readonly<{
    /** The name of the component that caused the error */
    component?: string;

    /** The time limit that was exceeded */
    limit?: number;
  }>;
}

const REASON_MESSAGES: Record<HydrationErrorReason, string> = {
  not_registered: "The island component is not registered",
  invalid_component: "The island component is invalid",
  timeout: "Hydration timed out",
};
/**
 * Runtime hydration error
 */
export class HydrationError extends BaseError<HydrationErrorMeta> {
  /** Error code */
  readonly code: `hydration:${HydrationErrorReason}`;

  /**
   * @param reason - The reason for the hydration error
   * @param meta - Additional metadata for the error
   */
  constructor(reason: HydrationErrorReason, meta?: Omit<HydrationErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `hydration:${reason}`;
  }
}
