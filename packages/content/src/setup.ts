import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { DatabaseModuleEvents } from "@comity/database";
import type { LoggerModuleContext } from "@comity/logger";
import type { ContentModuleOptions } from "./types.js";

export const setup: ApplicationModuleMeta<
  ContentModuleOptions,
  ApplicationContext & LoggerModuleContext
> = {
  name: "@comity/content",
  version: "1.0.0",
  setup: async (options = {}) => {
    return async (ctx) => {
      // Register for database:initialized event for runtime
      ctx.onEvent<DatabaseModuleEvents["@comity/database:initialized"]>(
        "@comity/database:initialized",
        async ({ registerRepository }) => {
          const { ContentRepository } = await import(
            "./repositories/content.js"
          );
          const { ContentPageRepository } = await import(
            "./repositories/content-page.js"
          );

          registerRepository("content", ContentRepository);
          registerRepository("content-page", ContentPageRepository);
        }
      );
    };
  },
  dependsOn: ["@comity/application", "@comity/database", "@comity/logger"],
  incompatibleWith: [],
};

export default setup;
