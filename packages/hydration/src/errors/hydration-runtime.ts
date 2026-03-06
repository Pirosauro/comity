import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 *
 */
export interface HydrationRuntimeErrorComponentMeta extends ErrorMeta {
  /** */
  reason: "not_registered" | "invalid_component";

  /** */
  component: string;
}

/**
 *
 */
export interface HydrationRuntimeErrorTimeoutMeta extends ErrorMeta {
  /** */
  reason: "timeout";

  /** */
  limit: number;
}

/**
 * Metadata for runtime hydration errors
 */
export type HydrationRuntimeErrorMeta =
  | HydrationRuntimeErrorComponentMeta
  | HydrationRuntimeErrorTimeoutMeta;

/**
 * Runtime hydration error
 */
export class HydrationRuntimeError extends BaseError {
  /** Error code */
  readonly code = "hydration:runtime_error";

  /**
   * @param message - Error message
   * @param meta - Error metadata
   */
  constructor(message = "Hydration failed", meta: HydrationRuntimeErrorMeta) {
    super(message, meta);
  }
}
