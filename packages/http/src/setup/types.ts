import type { HttpObserver } from "../hooks/observer.js";

/**
 * Options for the HTTP module.
 */
export interface HttpModuleOptions extends Record<string, unknown> {}

/**
 * Events emitted by the HTTP module.
 */
export interface HttpModuleEvents {
  /** Event emitted when an HTTP request is started. */
  "@comity/http:request-started": Parameters<HttpObserver["onRequestStarted"]>[0];

  /** Event emitted when an HTTP request is completed. */
  "@comity/http:request-completed": Parameters<HttpObserver["onRequestCompleted"]>[0];

  /** Event emitted when an HTTP request fails. */
  "@comity/http:request-failed": Parameters<HttpObserver["onRequestFailed"]>[0];
}

/**
 * Hooks executed by the HTTP module.
 */
export interface HttpModuleHooks {}
