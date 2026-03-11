import type { ModuleSetupContext } from "@comity/composition";
import type { RoutePolicyHandler } from "../contracts/route.js";
import type { Router } from "../contracts/router.js";
import type { UrlRewriter } from "../contracts/url-rewriter.js";
import type { ROUTER_TOKEN } from "./constants.js";

/**
 * Options for the router module.
 */
export type RouterModuleOptions = Readonly<{
  /** List of routers */
  routers?: Router[];

  /** List of URL rewriters */
  rewriters?: UrlRewriter[];

  /** List of route policies */
  policies?: Record<string, RoutePolicyHandler>;
}>;

/**
 * Events emitted by the router module.
 */
export type RouterModuleEvents = {};

/**
 * Hooks provided by the router module.
 */
export type RouterModuleHooks = {
  /** Emitted when the router module is initialized */
  "@comity/router:initialized": void;

  /** Emitted during the configuration phase, allowing hooks to modify the router configuration */
  "@comity/router:configuring": RouterModuleOptions;
};

/**
 * Services exposed by the module
 */
export type RouterModuleServices = {
  /** Hono HTTP adapter facade token */
  [ROUTER_TOKEN]: unknown;
};

/**
 * Context provided to the router module setup function.
 */
export interface RouterModuleContext extends ModuleSetupContext<
  RouterModuleServices,
  RouterModuleEvents,
  RouterModuleHooks
> {}
