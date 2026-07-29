import type { ErrorMeta } from "@comity/primitives/errors";

import { BaseError } from "@comity/primitives/errors";

/**
 * Storage error reasons.
 */
export type StorageErrorReason =
  | "missing_store"
  | "not_found"
  | "put_failed"
  | "get_failed"
  | "delete_failed"
  | "signed_url_failed"
  | "internal";

/**
 * Metadata for storage errors.
 */
export interface StorageErrorMeta extends ErrorMeta {
  /** The reason for the storage error. */
  reason: StorageErrorReason;

  /** Additional details about the storage error, such as the key and namespace involved. */
  details?: Readonly<{
    /** The key associated with the storage error. */
    key?: string;

    /** The namespace associated with the storage error. */
    namespace?: string;

    /** The violation associated with the storage error. */
    violation?: string;
  }>;
}

const REASON_MESSAGES: Record<StorageErrorReason, string> = {
  missing_store: "Storage store not configured",
  not_found: "Storage object not found",
  put_failed: "Failed to store object",
  get_failed: "Failed to retrieve object",
  delete_failed: "Failed to delete object",
  signed_url_failed: "Failed to generate signed URL",
  internal: "Internal error",
};

/**
 * Storage module errors.
 */
export class StorageError extends BaseError<StorageErrorMeta> {
  readonly code: `storage:${StorageErrorReason}`;

  constructor(reason: StorageErrorReason, meta?: Omit<StorageErrorMeta, "reason">) {
    super(REASON_MESSAGES[reason], {
      ...meta,
      reason,
    });

    this.code = `storage:${reason}`;
  }
}
