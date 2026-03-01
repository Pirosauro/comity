import type { ErrorMeta } from "../../error/types.js";

import { BaseError } from "../../error/base.js";

/**
 * Reasons for EventBus errors.
 */
export type EventBusErrorReason = "handler_failed";

const REASON_MESSAGES: Record<EventBusErrorReason, string> = {
  handler_failed: "Event handler failed",
};

/**
 * EventBus Error.
 */
export class EventBusError extends BaseError {
  readonly code: `event-bus:${EventBusErrorReason}`;

  /**
   * @param reason - The reason for the EventBus error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: EventBusErrorReason, meta?: ErrorMeta) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `event-bus:${reason}`;
  }
}
