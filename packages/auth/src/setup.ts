import type {
  ApplicationContext,
  ApplicationModuleHooks,
  ApplicationModuleMeta,
} from "@comity/application";
import type { LoggerModuleContext } from "@comity/logger";
import type {
  AuthModuleContext,
  AuthModuleEvents,
  AuthModuleHooks,
  AuthModuleOptions,
  AuthService,
} from "./types.js";
import { createJWTMiddleware } from "./middleware.js";
import {
  handleLogin,
  handleLogout,
  handleRefresh,
  signToken,
} from "./utils/index.js";

export const setup: ApplicationModuleMeta<
  AuthModuleOptions,
  ApplicationContext & AuthModuleContext & LoggerModuleContext
> = {
  name: "@comity/auth",
  version: "1.0.0",
  setup: async (options) => {
    if (!options?.secret) {
      throw new Error("JWT secret is required for @comity/auth module");
    }

    return async (ctx) => {
      // Create auth service with context for event emission
      const service: AuthService = {
        login: async (user, c) => {
          const token = await handleLogin(user, c, options);

          // Emit login event
          await ctx.emit<AuthModuleEvents["@comity/auth:user-logged-in"]>(
            "@comity/auth:user-logged-in",
            { user, token }
          );

          return token;
        },
        logout: async (c) => {
          const user = c.get("user");

          handleLogout(c, options);

          // Emit logout event
          await ctx.emit<AuthModuleEvents["@comity/auth:user-logged-out"]>(
            "@comity/auth:user-logged-out",
            { user }
          );
        },
        refreshToken: async (c) => {
          const now = Math.floor(Date.now() / 1000);
          const { outdated, current } = await handleRefresh(c, options);

          // Emit token refresh event
          await ctx.emit<AuthModuleEvents["@comity/auth:token-refreshed"]>(
            "@comity/auth:token-refreshed",
            {
              outdated,
              current,
              timestamp: now,
            }
          );

          return current;
        },
        signToken: (user) => signToken(user, options),
      };

      // Apply JWT middleware
      ctx.onHook<ApplicationModuleHooks["@comity/application:initialized"]>(
        "@comity/application:initialized",
        (app) => {
          app.use(createJWTMiddleware(options, ctx));
        }
      );

      // Emit service via events
      await ctx.emit<AuthModuleHooks["@comity/auth:initialized"]>(
        "@comity/auth:initialized",
        service
      );

      ctx.auth = service;
    };
  },
  requires: ["@comity/application", "@comity/logger"],
  priority: 10,
  incompatibleWith: [],
};

export default setup;
