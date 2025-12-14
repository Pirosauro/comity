import type {
  ApplicationContext,
  ApplicationModuleMeta,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type { ReactModuleContext, ReactModuleOptions } from "./types.js";

export const setup: ApplicationModuleMeta<
  ReactModuleOptions,
  ApplicationContext & ReactModuleContext & LoggerModuleContext
> = {
  name: "@comity/react",
  version: "1.0.0",
  setup: async (options) => {
    return async (ctx) => {};
  },
  dependsOn: ["@comity/application", "@comity/hydration", "@comity/logger"],
  incompatibleWith: ["@comity/preact"],
};

export default setup;
