import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 *
 */
export type ValidatorErrorReason = ;

/**
 *
 */
export interface ValidatorErrorMeta extends ErrorMeta {
  /**
   *
   */
  reason: ValidatorErrorReason;

  /**
   *
   */
  details?: Readonly<{
    /**
     *
     */
    key?: string;
  }>;
}

const REASON_MESSAGES: Record<ValidatorErrorReason, string> = {
};

/**
 * Validator module errors.
 */
export class ValidatorError extends BaseError<ValidatorErrorMeta> {
  readonly code: `validator:${ValidatorErrorReason}`;

  constructor(reason: ValidatorErrorReason, meta?: Omit<ValidatorErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `validator:${reason}`;
  }
}
