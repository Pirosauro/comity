import type { ModuleMeta } from "@comity/core";
import type {
  AuthModuleHooks,
  AuthModuleContext,
  AuthModuleOptions,
} from "./types.js";

import { withAuthEvents } from "../internal/auth-events.js";

/**
 * Auth Module for Comity
 *
 * Integrates authentication and authorization into the application lifecycle.
 * Provides session management, step-up auth, and refresh capabilities.
 *
 * What it offers:
 * - Policy-driven session validation and assurance scoring
 * - Step-up authentication for privilege escalation
 * - Session refresh with configurable requirements
 * - Event emission for monitoring and integration
 *
 * What it excludes:
 * - Transport mechanisms (HTTP, JWT, etc. - use adapters)
 * - User storage or credential validation (external systems)
 *
 * Invariants:
 * - Requires an AuthOrchestrator to be configured
 * - Exposes auth service on context (ctx.auth available after setup)
 * - Events are emitted after state changes, not before
 */
export const module: ModuleMeta<
  AuthModuleOptions<any, any, any, any>,
  AuthModuleContext
> = {
  name: "@comity/auth",
  version: "1.0.0",

  setup: async (options) => {
    if (!options?.orchestrator) {
      throw new Error("@comity/auth requires an AuthOrchestrator");
    }

    return async (ctx) => {
      // Wrap orchestrator with event emission (invariant: events are observational)
      const service = withAuthEvents(options.orchestrator, ctx.emit.bind(ctx));

      // Signal initialization complete (hook for other modules)
      await ctx.trigger<AuthModuleHooks["@comity/auth:initialized"]>(
        "@comity/auth:initialized",
        service
      );

      // Expose service (invariant: ctx.auth is now available)
      ctx.auth = service;
    };
  },

  dependsOn: ["@comity/core"],
  priority: 10,
  incompatibleWith: [],
};

export default module;
