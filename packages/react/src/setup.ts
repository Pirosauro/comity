import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type {
  ReactModuleContext,
  ReactModuleEvents,
  ReactModuleHooks,
  ReactModuleOptions,
} from "./types.js";

export const setup: ApplicationModuleMeta<
  ReactModuleOptions,
  ApplicationContext & ReactModuleContext & LoggerModuleContext
> = {
  name: "@comity/react",
  version: "1.0.0",
  setup: async (options) => {
    return async (ctx) => {
      // Emit service via events
      await ctx.emit<ReactModuleHooks["@comity/react:initialized"]>(
        "@comity/react:initialized"
      );
    };
  },
  dependsOn: ["@comity/application", "@comity/hydration", "@comity/logger"],
  incompatibleWith: [],
};

export default setup;
