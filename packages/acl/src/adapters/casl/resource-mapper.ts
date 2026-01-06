import type { AccessRequest } from "../../core/types";

import { subject } from "@casl/ability";

/**
 * Map ACL resource to CASL subject format.
 *
 * Invariants:
 * - Returns CASL subject for instance-level checks (with id)
 * - Returns resource type string for type-level checks
 * - Preserves all resource attributes
 *
 * Misuse Prevention:
 * - Do not modify returned subject objects
 * - Understand difference between instance and type checks
 */
export function mapResourceToCasl(
  resource: AccessRequest<{}, { field?: string }>["resource"]
) {
  // Instance-level check (invariant: includes id and attributes)
  if (resource.id) {
    return subject(resource.type, {
      id: resource.id,
      ...resource.attributes,
    });
  }

  // Type-level check (invariant: type string only)
  return resource.type;
}
