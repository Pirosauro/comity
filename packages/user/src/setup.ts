import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { AuthModuleContext } from "@comity/auth";
import type { LoggerModuleContext } from "@comity/logger";
import type { DatabaseModuleEvents } from "@comity/database";
import type { UserModuleOptions } from "./types.js";
import { createUserMiddleware } from "./middleware.js";

export const setup: ApplicationModuleMeta<
  UserModuleOptions,
  ApplicationContext & AuthModuleContext & LoggerModuleContext
> = {
  name: "@comity/user",
  version: "1.0.0",
  setup: async (options) => {
    options = options || {};

    return async (ctx) => {
      // Register for database:initialized event for runtime
      ctx.onEvent<DatabaseModuleEvents["@comity/database:initialized"]>(
        "@comity/database:initialized",
        async ({ registerRepository }) => {
          const { RoleRepository } = await import("./repositories/role.js");
          const { UserActivityRepository } = await import(
            "./repositories/user-activity.js"
          );
          const { UserRoleRepository } = await import(
            "./repositories/user-role.js"
          );
          const { UserRepository } = await import("./repositories/user.js");

          registerRepository("role", RoleRepository);
          registerRepository("userActivity", UserActivityRepository);
          registerRepository("userRole", UserRoleRepository);
          registerRepository("user", UserRepository);
        }
      );

      // Register for application:initialized hook for runtime
      ctx.onHook<ApplicationModuleHooks["@comity/application:initialized"]>(
        "@comity/application:initialized",
        async (app) => {
          app.use(createUserMiddleware(options, ctx));
        }
      );
    };
  },
  requires: ["@comity/auth", "@comity/workspace", "@comity/database"],
  incompatibleWith: [],
};

export default setup;
