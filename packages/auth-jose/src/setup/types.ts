import type { AuthTokenService } from "@comity/auth";
import type { ModuleSetupContext } from "@comity/composition";
import type { AuthJoseEventEmitter } from "../lifecycle/emitter.js";
import type { JoseAuthTokenServiceOptions } from "../types.js";

import type { AUTH_JOSE_TOKEN } from "./constants.js";

/**
 * Services provided by the module.
 */
export type JoseAuthModuleServices = {
  /** Service for signing and verifying JOSE tokens. */
  [AUTH_JOSE_TOKEN]: AuthTokenService;
};

/**
 * Hooks exposed by the module.
 */
export type JoseAuthModuleHooks = {
  /** Emitted when the module is initialized. */
  "@comity/auth-jose:initialized": {
    /** The token service provided by the module. */
    token: typeof AUTH_JOSE_TOKEN;
  };
};

/**
 * Events emitted by the module.
 */
export type JoseAuthModuleEvents = {
  /**
   * Emitted when a token is successfully verified.
   */
  "@comity/auth-jose:token_verified": Parameters<AuthJoseEventEmitter["onTokenVerified"]>[0];

  /**
   * Emitted when a token is found to be invalid.
   */
  "@comity/auth-jose:token_invalid": Parameters<AuthJoseEventEmitter["onTokenInvalid"]>[0];
};

/**
 * Context injected by the auth module.
 */
export interface JoseAuthModuleContext extends ModuleSetupContext<
  JoseAuthModuleServices,
  JoseAuthModuleEvents,
  JoseAuthModuleHooks
> {}

/**
 * Auth module setup options.
 */
export interface JoseAuthModuleOptions
  extends JoseAuthTokenServiceOptions, Record<string, unknown> {}
