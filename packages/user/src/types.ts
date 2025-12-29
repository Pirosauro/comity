import type { AnyMongoAbility } from "@casl/ability";

/**
 * Defines the operational scope of the User module.
 * It can be set to FRONTEND, BACKEND, or both.
 */
export enum UserModuleScope {
  FRONTEND = 1 << 0,
  BACKEND = 1 << 1,
}

/**
 * Options for configuring the User module.
 *
 * scope: Defines the operational scope of the User module.
 *        It can be set to FRONTEND, BACKEND, or both.
 *        Default is BACKEND only.
 */
export type UserModuleOptions = {
  scope?: UserModuleScope;
};

/**
 * Hooks triggered by the User module.
 *
 * These events allow other modules to react to user-related
 * actions and access the User service.
 */
export type UserModuleHooks = {
  /**
   * Emitted when the User module is fully initialized and ready.
   * Provides the Hono instance for other modules to use.
   */
  "@comity/user:initialized": {};
};

export type UserModuleEvents = {
  "@comity/user:error": { error: Error };
};

/**
 * Extends the Hono context with User module specific properties.
 */
export type UserModuleHonoContext = {
  Variables: {
    ability: AnyMongoAbility;
  };
};

export type UserModuleResolvedEvents = {};
