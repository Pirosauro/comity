import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type { WorkspaceModuleOptions } from "./types.js";
import { createWorkspaceMiddleware } from "./middleware-factory.js";

export const setup: ApplicationModuleMeta<
  WorkspaceModuleOptions,
  ApplicationContext & LoggerModuleContext
> = {
  name: "@comity/workspace",
  version: "1.0.0",
  setup: async (options = {}) => {
    return async (ctx) => {
      // Register workspace repositories when database is initialized
      ctx.onHook(
        "@comity/database:initialized",
        async ({ registerRepository }: any) => {
          try {
            const { TenantRepository } = await import(
              "./repositories/tenant.js"
            );
            const { OrganizationRepository } = await import(
              "./repositories/organization.js"
            );
            const { WorkspaceRepository } = await import(
              "./repositories/workspace.js"
            );

            registerRepository("tenant", TenantRepository);
            registerRepository("organization", OrganizationRepository);
            registerRepository("workspace", WorkspaceRepository);
          } catch (error) {
            ctx.logger?.error({
              msg: "Failed to register workspace repositories",
              error,
            });
          }
        }
      );

      // On application init, mount workspace middleware
      ctx.onHook<ApplicationModuleHooks["@comity/application:initialized"]>(
        "@comity/application:initialized",
        async (app) => {
          app.use(createWorkspaceMiddleware(options, ctx));
        }
      );
    };
  },
  dependsOn: ["@comity/application", "@comity/postgres", "@comity/logger"],
  optionalDependsOn: [],
  incompatibleWith: [],
};

export default setup;
