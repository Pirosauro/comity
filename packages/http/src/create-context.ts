import type { ModuleSetupContext } from "@comity/composition";
import type { HttpRuntimeContext } from "./contracts/context.js";

/**
 * Creates an HTTP runtime context from the module setup context, providing access to kernel services and events.
 *
 * @param ctx - Module setup context providing access to kernel services and hooks.
 *
 * @returns HTTP runtime context with access to kernel services and events.
 */
export function createHttpContext(ctx: ModuleSetupContext): HttpRuntimeContext {
  return {
    services: {
      resolve: ctx.services.resolve.bind(ctx.services),
    },

    events: ctx.events,
  };
}
