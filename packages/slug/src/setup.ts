import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { PostgresModuleHooks } from "@comity/postgres";
import type { LoggerModuleContext } from "@comity/logger";
import type { SlugModuleOptions } from "./types.js";
import { createSlugMiddleware } from "./middleware-factory.js";

export const setup: ApplicationModuleMeta<
  SlugModuleOptions,
  ApplicationContext & LoggerModuleContext
> = {
  name: "@comity/slug",
  version: "1.0.0",
  setup: async (options = {}) => {
    return async (ctx) => {
      // Register for database:initialized event for runtime
      ctx.onEvent<PostgresModuleHooks["@comity/postgres:initialized"]>(
        "@comity/postgres:initialized",
        async ({ registerRepository }) => {
          const { SlugRepository } = await import("./repositories/slug.js");

          registerRepository("slug", SlugRepository);
        }
      );

      // Register for application:initialized hook for runtime
      ctx.onHook<ApplicationModuleHooks["@comity/application:initialized"]>(
        "@comity/application:initialized",
        async (app) => {
          app.use(createSlugMiddleware(options, ctx, app));
        }
      );
    };
  },
  dependsOn: [
    "@comity/application",
    "@comity/logger",
    "@comity/postgres",
    "@comity/workspace",
  ],
  incompatibleWith: [],
};

export default setup;
