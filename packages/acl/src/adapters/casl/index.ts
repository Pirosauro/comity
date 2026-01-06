/**
 * @comity/acl/adapters/casl - CASL Access Control Adapter
 *
 * Provides integration with the CASL (Centralized Access Control Library) for JavaScript.
 *
 * What it offers:
 * - CASL ability-based access control
 * - Field-level permission checking
 * - Subject-specific ability definitions
 * - Policy name resolution for audit
 *
 * What it deliberately excludes:
 * - CASL ability storage or persistence
 * - HTTP integration (use http adapter)
 * - User/role management
 *
 * Usage:
 * ```typescript
 * import { createCaslAccessControl } from "@comity/acl/adapters/casl";
 * import { defineAbility } from "@casl/ability";
 *
 * const provider = createCaslAccessControl({
 *   defineAbility: (subject) => defineAbility((can, cannot) => {
 *     // Define abilities based on subject
 *     if (subject.roles?.includes("admin")) {
 *       can("manage", "all");
 *     }
 *   })
 * });
 * ```
 */

export * from "./access-control.js";
export * from "./resource-mapper.js";
export * from "./types.js";
