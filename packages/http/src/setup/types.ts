import type { ModuleSetupContext } from "@comity/composition";
import type { HttpHandler } from "../contracts/handler.js";
import type { HttpMiddleware } from "../contracts/middleware.js";
import type { HttpFacade } from "../facade.js";
import type { HttpObserver } from "../hooks/observer.js";
import type { HTTP_TOKEN } from "./constants.js";

/**
 * Options for the HTTP module.
 */
export type HttpModuleOptions = {
  /** Middleware to apply to the HTTP handler. */
  middleware?: HttpMiddleware[];

  /** Final HTTP handler to execute after middleware. */
  handler?: HttpHandler;
};

/**
 * Events emitted by the HTTP module.
 */
export type HttpModuleEvents = {
  /** Event emitted when an HTTP request is started. */
  "@comity/http:request-started": Parameters<HttpObserver["onRequestStarted"]>[0];

  /** Event emitted when an HTTP request is completed. */
  "@comity/http:request-completed": Parameters<HttpObserver["onRequestCompleted"]>[0];

  /** Event emitted when an HTTP request fails. */
  "@comity/http:request-failed": Parameters<HttpObserver["onRequestFailed"]>[0];
};

/**
 * Hooks executed by the HTTP module.
 */
export type HttpModuleHooks = {
  /** Hook executed during module setup to allow configuration of the HTTP pipeline. */
  "@comity/http:configuring": HttpModuleOptions;

  /** Hook executed when the HTTP module is initialized. */
  "@comity/http:initialized": undefined;
};

/**
 * Services exposed by the module
 */
export type HttpModuleServices = {
  /** Facade providing access to the HTTP handling functionality. */
  [HTTP_TOKEN]: HttpFacade;
};

/**
 * Context provided to the Hono HTTP adapter module setup function.
 */
export interface HttpModuleContext extends ModuleSetupContext<
  HttpModuleServices,
  HttpModuleEvents,
  HttpModuleHooks
> {}
