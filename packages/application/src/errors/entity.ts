import type { HttpStatus } from "@comity/http";
import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Reasons for entity errors.
 */
export type EntityErrorReason = "not_found" | "invalid_id" | "repository_error";

/**
 * Metadata for entity errors.
 */
export interface EntityErrorMeta extends ErrorMeta {
  /** Reason for the entity error */
  readonly reason: EntityErrorReason;

  /**
   *
   */
  readonly details: Readonly<{
    /**  */
    type: string;

    /**  */
    id?: string;

    /**  */
    repository?: string;
  }>;
}

const REASON_MESSAGES: Record<EntityErrorReason, string> = {
  not_found: "The requested entity was not found",
  invalid_id: "The provided entity ID is invalid",
  repository_error: "An error occurred in the entity repository",
};

const REASON_HTTP_STATUS: Record<EntityErrorReason, HttpStatus> = {
  not_found: 404,
  invalid_id: 400,
  repository_error: 500,
};

/**
 * Entity error
 */
export class EntityError extends BaseError<EntityErrorMeta> {
  /** Error code */
  readonly code: `entity:${EntityErrorReason}`;

  /**
   * @param reason - The reason for the entity error
   * @param meta - Additional metadata for the error
   */
  constructor(reason: EntityErrorReason, meta: Omit<EntityErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      httpStatus: REASON_HTTP_STATUS[reason],
      ...meta,
      reason,
    });

    this.code = `entity:${reason}`;
  }
}
