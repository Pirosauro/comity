import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type { PostgresModuleOptions } from "./types.js";
import { createDatabaseMiddleware } from "./middleware.js";

export const setup: ApplicationModuleMeta<
  PostgresModuleOptions,
  ApplicationContext & LoggerModuleContext
> = {
  name: "@comity/postgres",
  version: "1.0.0",
  setup: async (options) => {
    return async (ctx) => {
      const middleware = createDatabaseMiddleware(options, ctx);

      ctx.onHook<ApplicationModuleHooks["@comity/application:initialized"]>(
        "@comity/application:initialized",
        (app) => {
          app.use(middleware);
        }
      );
    };
  },
  dependsOn: ["@comity/application", "@comity/logger"],
  incompatibleWith: [],
};

export default setup;
