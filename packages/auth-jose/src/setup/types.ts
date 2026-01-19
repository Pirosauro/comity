import type { AuthJoseEventEmitter } from "../events/auth-jose.js";
import type { JoseAuthTokenService, JoseAuthTokenServiceOptions } from "../services/auth-token.js";

/**
 * Hooks exposed by the module.
 */
export type JoseAuthModuleHooks = {};

/**
 * Events emitted by the module.
 */
export type JoseAuthModuleEvents = {
  /**
   * Emitted when a token is successfully verified.
   */
  "@comity/auth-jose:token_verified": Parameters<AuthJoseEventEmitter["tokenVerified"]>[0];

  /**
   * Emitted when a token is found to be invalid.
   */
  "@comity/auth-jose:token_invalid": Parameters<AuthJoseEventEmitter["tokenInvalid"]>[0];
};

/**
 * Context injected by the auth module.
 */
export type JoseAuthModuleContext = {
  /** JOSE auth token service */
  "auth.token": JoseAuthTokenService;
};

/**
 * Auth module setup options.
 */
export type JoseAuthModuleOptions = JoseAuthTokenServiceOptions;
