import type { ModuleMeta } from "@comity/composition";
import type { HttpModuleContext } from "@comity/http";
import type { RouterModuleContext, RouterModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";
import { createRouterHttpHandler } from "../create-route-handler.js";
import { RouterPipeline } from "../pipeline.js";

/**
 * Router module.
 */
export const module: ModuleMeta<RouterModuleOptions, RouterModuleContext & HttpModuleContext> = {
  name: "@comity/router",
  version: "1.0.0",

  dependsOn: { "@comity/http": { optional: false } },
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: RouterModuleOptions = { ...options };
    const cfg: RouterModuleOptions =
      (await ctx.hooks.execute("@comity/router:configuring", initial)) ?? initial;
    const pipeline = new RouterPipeline(cfg.routers || [], cfg.rewriters || [], cfg.policies || {});

    // Configure the HTTP adapter to use the router pipeline as the request handler
    ctx.hooks.define("@comity/http:configuring", (v, i) => {
      const httpHandler = createRouterHttpHandler(pipeline);

      return { ...v, handler: httpHandler };
    });

    return success(async () => {
      // Emit module initialized hook
      await ctx.hooks.execute("@comity/router:initialized", undefined);

      return success(undefined);
    });
  },
};

export default module;
