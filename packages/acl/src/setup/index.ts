import type { ModuleMeta } from "@comity/core";
import type {
  AclModuleOptions,
  AclModuleHooks,
  AclModuleContext,
} from "./types.js";

import { withAclEvents } from "../internal/acl-events.js";

/**
 * ACL Module for Comity
 *
 * Integrates access control into the application lifecycle.
 * Requires an AccessControlProvider to be configured.
 *
 * What it offers:
 * - Policy-based access control evaluation
 * - Event emission for audit and monitoring
 * - Framework integration through context injection
 *
 * What it excludes:
 * - Policy definition or storage (handled by adapters)
 * - User/role management (handled by auth module)
 * - HTTP transport (use adapters for framework binding)
 *
 * Invariants:
 * - Requires AccessControlProvider configuration
 * - Exposes acl service on context after setup
 * - Events are emitted after state changes, not before
 */
export const module: ModuleMeta<AclModuleOptions, AclModuleContext> = {
  name: "@comity/acl",
  version: "1.0.0",

  setup: async (options) => {
    if (!options?.provider) {
      throw new Error("@comity/acl requires an AccessControlProvider");
    }

    return async (ctx) => {
      // Wrap provider with event emission for observability
      const service = withAclEvents(options.provider, ctx.emit.bind(ctx));

      // Expose ACL service on context (invariant: ctx.acl is now available)
      ctx.acl = service;

      // Signal that ACL is ready for use
      await ctx.trigger<AclModuleHooks["@comity/acl:initialized"]>(
        "@comity/acl:initialized",
        service
      );
    };
  },

  dependsOn: ["@comity/core"],
  incompatibleWith: [],
};

export default module;
