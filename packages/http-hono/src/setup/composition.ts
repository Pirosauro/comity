import type { ModuleMeta } from "@comity/composition/setup";
import type { HttpModuleContext } from "@comity/http/setup";
import type { HttpHonoModuleContext, HttpHonoModuleOptions } from "./types.js";

import { createHttpContext } from "@comity/http";
import { HTTP_TOKEN } from "@comity/http/setup";
import { success } from "@comity/primitives/result";
import { Hono } from "hono/quick";
import { httpHonoAdapter } from "../adapter.js";
import { HTTP_HONO_TOKEN } from "./constants.js";

export default {
  name: "@comity/http-hono",
  version: "0.9.0",

  dependsOn: { "@comity/http": { optional: false } },
  incompatibleWith: [],

  /** @inheritdoc */
  setup: async (ctx, options) => {
    const initial: HttpHonoModuleOptions = { ...options };

    let hono: Hono | undefined;

    ctx.services.define(HTTP_HONO_TOKEN, () => hono!);

    return success(async () => {
      const cfg = (await ctx.hooks.execute("@comity/http-hono:configuring", initial)) ?? initial;

      hono = new Hono(cfg);

      const facade = ctx.services.resolve(HTTP_TOKEN);
      const runtime = createHttpContext(ctx);

      httpHonoAdapter(hono, facade, runtime);

      await ctx.hooks.execute("@comity/http-hono:initialized", undefined);

      return success(undefined);
    });
  },
} satisfies ModuleMeta<HttpHonoModuleOptions, HttpHonoModuleContext & HttpModuleContext>;
