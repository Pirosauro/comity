import type { ErrorMeta } from "@comity/primitives/error";

import { BaseError } from "@comity/primitives/error";

/**
 * Reasons for composition errors.
 */
export type CompositionErrorReason =
  | "resolution_failed"
  | "setup_failed"
  | "apply_failed"
  | "cycle_detected"
  | "missing_dependency"
  | "incompatible";

/**
 * Composition Error metadata.
 */
export interface CompositionErrorMeta extends ErrorMeta {
  /** Module involved (if applicable) */
  readonly module?: string;

  /** Dependency involved (if applicable) */
  readonly dependency?: string;

  /** Cycle graph (if applicable) */
  readonly cycle?: readonly string[];
}

/** Error messages for composition errors */
const REASON_MESSAGES: Record<CompositionErrorReason, string> = {
  resolution_failed: "Resolution failed",
  setup_failed: "Setup failed",
  apply_failed: "Application failed",
  cycle_detected: "Dependency cycle detected",
  missing_dependency: "Required dependency missing",
  incompatible: "Incompatible modules",
};
/** Error HTTP status codes for composition errors */
const REASON_HTTP_STATUS: Record<CompositionErrorReason, number> = {
  resolution_failed: 500,
  setup_failed: 500,
  apply_failed: 500,
  cycle_detected: 400,
  missing_dependency: 400,
  incompatible: 400,
};

/**
 * Composition Error.
 */
export class CompositionError extends BaseError<CompositionErrorMeta> {
  /** Error code */
  readonly code: `composition:${CompositionErrorReason}`;

  /**
   * @param reason - The reason for the composition error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: CompositionErrorReason, meta?: Omit<CompositionErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      httpStatus: REASON_HTTP_STATUS[reason],
      reason,
    });

    this.code = `composition:${reason}`;
  }
}
