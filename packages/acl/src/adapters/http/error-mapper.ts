import { ForbiddenError } from "@comity/core/errors";
import { ACL_ACCESS_DENY_REASONS } from "../../core/constants.js";

/**
 * Map ACL denial reasons to HTTP errors.
 *
 * Invariants:
 * - Always returns Error instance (never throws)
 * - HTTP status codes appropriate for access control
 * - Preserves original ACL metadata in error
 *
 * Misuse Prevention:
 * - Do not catch and re-throw these errors (let them bubble to HTTP layer)
 * - Use only for HTTP contexts
 */
export function mapAclErrorToHttp(
  reason: string,
  meta?: {
    policy?: string;
    request?: unknown;
  }
): Error {
  switch (reason) {
    case ACL_ACCESS_DENY_REASONS.FORBIDDEN:
      return new ForbiddenError("Access denied", meta);

    default:
      // Fallback for unknown reasons (invariant: always ForbiddenError)
      return new ForbiddenError("ACL evaluation failed", {
        reason,
        ...meta,
      });
  }
}
