import type { ErrorMeta } from "@comity/primitives/error";
import type { GraphqlError } from "../contracts/error.js";

import { BaseError } from "@comity/primitives/error";

/**
 * Reasons for GraphQL client errors.
 */
export type GraphqlClientErrorReason =
  | "network_error"
  | "protocol_error"
  | "subscription_not_supported"
  | "transport_error";

/**
 * GraphQL client error metadata
 */
export interface GraphqlClientErrorMeta extends ErrorMeta {
  /** The reason for the GraphQL client error */
  reason: GraphqlClientErrorReason;

  /** Optional details about the GraphQL client error */
  details?: {
    /** The name of the GraphQL operation that caused the error */
    operationName?: string;

    /** The GraphQL errors returned by the server */
    errors?: GraphqlError[];
  };
}

const REASON_MESSAGES: Record<GraphqlClientErrorReason, string> = {
  network_error: "Network error occurred during GraphQL request",
  protocol_error: "Protocol error occurred during GraphQL request",
  subscription_not_supported: "GraphQL transport does not support subscriptions",
  transport_error: "Error occurred in GraphQL transport",
};

/**
 * GraphQL client errors.
 */
export class GraphqlClientError extends BaseError<GraphqlClientErrorMeta> {
  readonly code: `graphql:${GraphqlClientErrorReason}`;

  /**
   * @param reason - The reason for the GraphQL client error
   * @param meta - Additional metadata for the error
   */
  constructor(reason: GraphqlClientErrorReason, meta?: Omit<GraphqlClientErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `graphql:${reason}`;
  }
}
