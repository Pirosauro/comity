/**
 * @comity/acl - Access Control List Module
 *
 * Provides a framework-agnostic access control system for Comity applications.
 *
 * What it offers:
 * - Policy-based access control with composable policies
 * - Subject-resource-action authorization checks
 * - Event emission for audit and monitoring
 * - Extensible provider system for different ACL engines (CASL, custom, etc.)
 *
 * What it deliberately excludes:
 * - Built-in policies or rules (must be provided via adapters)
 * - User/role management (handled by auth module)
 * - HTTP integration (use adapters for framework-specific binding)
 *
 * Usage:
 * ```typescript
 * import { module as aclModule } from "@comity/acl";
 * import { CaslProvider } from "@comity/acl/adapters/casl";
 *
 * const app = createApp([
 *   aclModule({ provider: new CaslProvider(abilities) })
 * ]);
 *
 * const decision = await app.acl.can({
 *   subject: { id: "user123" },
 *   action: "read",
 *   resource: { type: "document", id: "doc456" }
 * });
 * ```
 */

export * from "./core/constants.js";
export * from "./core/policy.js";
export * from "./core/types.js";
export * from "./core/vocabulary.js";

export * from "./setup/types.js";
