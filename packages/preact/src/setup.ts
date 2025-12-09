import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type {
  PreactModuleContext,
  PreactModuleEvents,
  PreactModuleHooks,
  PreactModuleOptions,
} from "./types.js";

export const setup: ApplicationModuleMeta<
  PreactModuleOptions,
  ApplicationContext & PreactModuleContext & LoggerModuleContext
> = {
  name: "@comity/preact",
  version: "1.0.0",
  setup: async (options) => {
    return async (ctx) => {
      // Emit service via events
      await ctx.emit<PreactModuleHooks["@comity/preact:initialized"]>(
        "@comity/preact:initialized"
      );
    };
  },
  dependsOn: ["@comity/application", "@comity/hydration", "@comity/logger"],
  incompatibleWith: [],
};

export default setup;
