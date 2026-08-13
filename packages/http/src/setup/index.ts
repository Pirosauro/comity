import type { ModuleMeta } from "@comity/composition";
import type { HttpObserver } from "../observers/observer.js";
import type { HttpModuleContext, HttpModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { HttpFacade } from "../facade.js";
import { createHttpHandler } from "../handler.js";
import { HTTP_TOKEN } from "./constants.js";

/**
 * Metadata for the HTTP module.
 *
 * @comity ai-jsdoc-skip
 */
export const module: ModuleMeta<HttpModuleOptions, HttpModuleContext> = {
  name: "@comity/http",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: HttpModuleOptions = { ...options };
    const cfg = (await ctx.hooks.execute("@comity/http:configuring", initial)) ?? initial;

    // Validate configuration
    if (!cfg.handler) {
      return failure(
        new CompositionError("setup_failed", {
          details: {
            module: "@comity/http",
          },
          context: {
            message: "No HTTP handler provided in module configuration.",
          },
        })
      );
    }

    // Init
    return success(async () => {
      const observer: HttpObserver = {
        /** @inheritdoc */
        onRequestStarted: (p) => {
          ctx.events.emit("@comity/http:request-started", p);
        },

        /** @inheritdoc */
        onRequestCompleted: (p) => {
          ctx.events.emit("@comity/http:request-completed", p);
        },

        /** @inheritdoc */
        onRequestFailed: (p) => {
          ctx.events.emit("@comity/http:request-failed", p);
        },
      };

      // 1. build pipeline
      const httpHandler = createHttpHandler(cfg.middleware ?? [], cfg.handler!);
      // 2. build facade
      const facade = new HttpFacade(httpHandler, observer);

      // 3. register service
      ctx.services.define(HTTP_TOKEN, () => facade);

      // 4. lifecycle hook
      await ctx.hooks.execute("@comity/http:initialized", undefined);

      return success(undefined);
    });
  },
};

export default module;
