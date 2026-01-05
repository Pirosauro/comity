import type { ModuleMeta } from "@comity/core";
import type {
  AuthModuleHooks,
  AuthModuleContext,
  AuthModuleOptions,
} from "./types.js";

import { withAuthEvents } from "../internal/auth-events.js";

/**
 * Auth module setup for Comity.
 *
 * @remarks
 * This module wires an AuthOrchestrator into the application context
 * and exposes authentication lifecycle events.
 *
 * The module itself is transport-agnostic and does not assume
 * HTTP, JWT, cookies, or headers.
 *
 * Adapters (HTTP, JWT, etc.) must be composed externally and passed in.
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
      const service = withAuthEvents(options.orchestrator, ctx.emit.bind(ctx));

      ctx.trigger<AuthModuleHooks["@comity/auth:initialized"]>(
        "@comity/auth:initialized",
        service
      );

      // Expose orchestrator in context
      ctx.auth = service;
    };
  },

  dependsOn: ["@comity/core"],
  priority: 10,
  incompatibleWith: [],
};

export default module;
