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
import { createJWTMiddleware } from "./middleware-factory.js";
import {
  handleLogin,
  handleLogout,
  handleRefresh,
  signToken,
} from "./utils/index.js";

/**
 * Authentication module setup for Comity framework.
 *
 * @remarks
 * This module provides JWT-based authentication with middleware, token management,
 * and comprehensive event system. It integrates with Hono for request handling
 * and provides a clean API for login, logout, token refresh, and user management.
 *
 * Features:
 * - JWT token generation and verification using JOSE
 * - Automatic middleware for request authentication
 * - Cookie and header-based token extraction
 * - Token refresh with configurable windows
 * - Two-factor authentication support
 * - Comprehensive event system for monitoring
 * - Type-safe user context in Hono requests
 *
 * @example
 * ```typescript
 * // Basic setup
 * import { createApplication } from "@comity/application";
 * import { authSetup } from "@comity/auth";
 *
 * const app = createApplication([
 *   authSetup({
 *     secret: "your-jwt-secret",
 *     lifetime: 3600, // 1 hour
 *   })
 * ]);
 *
 * // Using the auth service
 * app.post("/login", async (c) => {
 *   const authService = c.get("auth");
 *   const token = await authService.login({ id: "user-123" }, c);
 *   return c.json({ token });
 * });
 * ```
 */
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
  dependsOn: ["@comity/application", "@comity/logger"],
  priority: 10,
  incompatibleWith: [],
};

export default setup;
