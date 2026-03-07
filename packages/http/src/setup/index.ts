import type { ModuleMeta } from "@comity/composition";
import type { HttpModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";

/**
 * Metadata for the HTTP module.
 *
 * @comity ai-jsdoc-skip
 */
export const module: ModuleMeta<HttpModuleOptions> = {
  name: "@comity/http",
  version: "1.0.0",

  dependsOn: {},
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (options) => {
    // if (!options?.adapter) {
    //   return failure(new DomainViolationError("HTTP adapter is required"));
    // }

    return success(async (ctx) => {
      //   const facade = new DefaultHttpFacade({
      //     /** @inheritdoc */
      //     requestStarted: (p) => {
      //       ctx.events.emit("@comity/http:request-started", p);
      //     },

      //     /** @inheritdoc */
      //     requestCompleted: (p) => {
      //       ctx.events.emit("@comity/http:request-completed", p);
      //     },

      //     /** @inheritdoc */
      //     requestFailed: (p) => {
      //       ctx.events.emit("@comity/http:request-failed", p);
      //     },
      //   });

      //   // Apply middlewares
      //   options?.middlewares?.forEach((middleware) => {
      //     facade.use(middleware);
      //   });

      //   // Attach adapter to the facade
      //   options.adapter.attach(facade);

      return success(undefined);
    });
  },
};

export default module;
