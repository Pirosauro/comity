import type { ChannelId } from "@comity/organization";

/**
 * Context for evaluating customer classifications (groups and segments).
 *
 * This context provides the operational environment for classification
 * evaluation. It is intentionally minimal and does not contain commercial
 * policy or purchase-specific data.
 */
export interface ClassificationContext {
  /** The sales channel context, if available. */
  readonly channel?: ChannelId;

  /** The tenant identifier, if available. */
  readonly tenant?: string;

  /** Additional opaque metadata for evaluation context. */
  readonly metadata?: Readonly<Record<string, unknown>>;
}
