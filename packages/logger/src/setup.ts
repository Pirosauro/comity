import type { ApplicationModuleMeta } from "@comity/application";
import type { LoggerModuleContext, LoggerModuleOptions } from "./types.js";
import { pino } from "pino";

export const setup: ApplicationModuleMeta<
  LoggerModuleOptions,
  LoggerModuleContext
> = {
  name: "@comity/logger",
  version: "1.0.0",
  setup: async (options = {}) => {
    const logger = pino(options);

    return async (ctx) => {
      ctx.logger = {
        fatal: logger.fatal.bind(logger),
        error: logger.error.bind(logger),
        warn: logger.warn.bind(logger),
        info: logger.info.bind(logger),
        debug: logger.debug.bind(logger),
        trace: logger.trace.bind(logger),
        silent: () => {},
        child: logger.child.bind(logger),
      };
    };
  },
  dependsOn: ["@comity/application"],
  incompatibleWith: [],
};

export default setup;
