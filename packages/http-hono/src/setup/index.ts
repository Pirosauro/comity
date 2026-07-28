import type { ModuleMeta } from "@comity/composition";
import type { HttpModuleContext } from "@comity/http";
import type { HttpHonoModuleContext, HttpHonoModuleOptions } from "./types.js";

import { createHttpContext, HTTP_TOKEN } from "@comity/http";
import { success } from "@comity/primitives/result";
import { Hono } from "hono/quick";
import { httpHonoAdapter } from "../adapter/http.js";
import { HTTP_HONO_TOKEN } from "./constants.js";

/**
 * Hono HTTP adapter kernel module.
 *
 * @remarks
 * This module does not perform any setup by itself. It is provided for
 * consistency with other Comity modules and to allow future integration
 * with kernel services.
 *
 * The adapter works independently of the kernel and can be used directly
 * via `httpHonoAdapter`.
 */
export const module: ModuleMeta<HttpHonoModuleOptions, HttpHonoModuleContext & HttpModuleContext> =
  {
    name: "@comity/http-hono",
    version: "0.9.0",

    dependsOn: { "@comity/http": { optional: false } },
    incompatibleWith: [],

    /** @inheritdoc */
    setup: async (ctx, options) => {
      const initial: HttpHonoModuleOptions = { ...options };
      const cfg = (await ctx.hooks.execute("@comity/http-hono:configuring", initial)) ?? initial;

      return success(async () => {
        const hono = new Hono(cfg);

        // 1. Resolve HTTP facade from the kernel
        const facade = ctx.services.resolve(HTTP_TOKEN);
        const runtime = createHttpContext(ctx);

        // 2. Initialize the adapter with the resolved facade and the Hono instance
        httpHonoAdapter(hono, facade, runtime);

        // 3. Register the Hono instance as a service in the kernel
        ctx.services.define(HTTP_HONO_TOKEN, () => hono);

        // 4. Emit module initialized hook
        await ctx.hooks.execute("@comity/http-hono:initialized", undefined);

        // 5. Return success with no additional data
        return success(undefined);
      });
    },
  };

export default module;
