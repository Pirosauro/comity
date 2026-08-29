import type { ModuleMeta } from "@comity/composition/setup";
import type { HttpObserver } from "../observers/observer.js";
import type { HttpModuleContext, HttpModuleOptions } from "./types.js";

import { CompositionError } from "@comity/composition/errors";
import { failure, success } from "@comity/primitives/result";
import { HttpFacade } from "../facade.js";
import { createHttpHandler } from "../handler.js";
import { HTTP_TOKEN } from "./constants.js";

export default {
  name: "@comity/http",
  version: "0.9.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: HttpModuleOptions = { ...options };

    let facade: HttpFacade | undefined;

    ctx.services.define(HTTP_TOKEN, () => facade!);

    return success(async () => {
      const cfg = (await ctx.hooks.execute("@comity/http:configuring", initial)) ?? initial;

      if (!cfg.handler) {
        return failure(
          new CompositionError("initialization_failed", {
            details: {
              module: "@comity/http",
            },
            context: {
              message: "No HTTP handler provided in module configuration.",
            },
          })
        );
      }

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

      const httpHandler = createHttpHandler(cfg.middleware ?? [], cfg.handler!);
      facade = new HttpFacade(httpHandler, observer);

      await ctx.hooks.execute("@comity/http:initialized", undefined);

      return success(undefined);
    });
  },
} satisfies ModuleMeta<HttpModuleOptions, HttpModuleContext>;
