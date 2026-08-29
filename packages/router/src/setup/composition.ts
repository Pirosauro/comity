import type { ModuleMeta } from "@comity/composition/setup";
import type { HttpModuleContext } from "@comity/http/setup";
import type { RouterModuleContext, RouterModuleOptions } from "./types.js";

import { success } from "@comity/primitives/result";
import { createRouterHttpHandler } from "../create-route-handler.js";
import { RouterPipeline } from "../pipeline.js";

const composition: ModuleMeta<RouterModuleOptions, RouterModuleContext & HttpModuleContext> = {
  name: "@comity/router",
  version: "0.9.0",

  dependsOn: { "@comity/http": { optional: false } },
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: RouterModuleOptions = { ...options };

    ctx.hooks.define("@comity/http:configuring", async (v) => {
      const cfg: RouterModuleOptions =
        (await ctx.hooks.execute("@comity/router:configuring", initial)) ?? initial;
      const pipeline = new RouterPipeline(
        cfg.routers || [],
        cfg.rewriters || [],
        cfg.policies || {}
      );

      return { ...v, handler: createRouterHttpHandler(pipeline) };
    });

    return success(async () => {
      await ctx.hooks.execute("@comity/router:initialized", undefined);

      return success(undefined);
    });
  },
};

export default composition;