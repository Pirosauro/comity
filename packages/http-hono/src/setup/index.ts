import type { ModuleMeta } from "@comity/composition/setup";
import type { HttpModuleContext } from "@comity/http/setup";
import type { HttpHonoModuleContext, HttpHonoModuleOptions } from "./types.js";

import { createHttpContext } from "@comity/http";
import { HTTP_TOKEN } from "@comity/http/setup";
import { success } from "@comity/primitives/result";
import { Hono } from "hono/quick";
import { httpHonoAdapter } from "../adapter.js";
import { HTTP_HONO_TOKEN } from "./constants.js";

export { HTTP_HONO_TOKEN } from "./constants.js";
export type {
  HttpHonoModuleContext,
  HttpHonoModuleEvents,
  HttpHonoModuleHooks,
  HttpHonoModuleOptions,
  HttpHonoModuleServices,
} from "./types.js";

/**
 * Hono HTTP adapter kernel module.
 *
 * @remarks
 * The module registers the Hono instance as a kernel service and wires it to
 * the HTTP facade resolved from `@comity/http` during initialization.
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

      let hono: Hono | undefined;

      ctx.services.define(HTTP_HONO_TOKEN, () => hono!);

      return success(async () => {
        const cfg = (await ctx.hooks.execute("@comity/http-hono:configuring", initial)) ?? initial;

        hono = new Hono(cfg);

        // 1. Resolve HTTP facade from the kernel
        const facade = ctx.services.resolve(HTTP_TOKEN);
        const runtime = createHttpContext(ctx);

        // 2. Initialize the adapter with the resolved facade and the Hono instance
        httpHonoAdapter(hono, facade, runtime);

        // 3. Emit module initialized hook
        await ctx.hooks.execute("@comity/http-hono:initialized", undefined);

        // 4. Return success with no additional data
        return success(undefined);
      });
    },
  };

export default module;
