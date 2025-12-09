import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type {
  HydrationModuleContext,
  HydrationModuleEvents,
  HydrationModuleHooks,
  HydrationModuleOptions,
} from "./types.js";

export const setup: ApplicationModuleMeta<
  HydrationModuleOptions,
  ApplicationContext & HydrationModuleContext & LoggerModuleContext
> = {
  name: "@comity/hydration",
  version: "1.0.0",
  setup: async (options) => {
    return async (ctx) => {
      // Emit service via events
      await ctx.emit<HydrationModuleHooks["@comity/hydration:initialized"]>(
        "@comity/hydration:initialized"
      );
    };
  },
  dependsOn: ["@comity/application", "@comity/logger"],
  incompatibleWith: [],
};

export default setup;
