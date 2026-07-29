import type { ErrorMeta } from "../../errors/types.js";

import { BaseError } from "../../errors/base.js";

/**
 * Metadata for EventBus errors.
 */
export interface EventBusErrorMeta extends ErrorMeta {
  /**
   * The reason for the EventBus error.
   */
  reason: EventBusErrorReason;

  /** Name of the event that caused the error, if applicable. */
  event: string;
}

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
export class EventBusError extends BaseError<EventBusErrorMeta> {
  readonly code: `event-bus:${EventBusErrorReason}`;

  /**
   * @param reason - The reason for the EventBus error.
   * @param meta - Additional metadata for the error.
   */
  constructor(reason: EventBusErrorReason, meta: Omit<EventBusErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `event-bus:${reason}`;
  }
}
