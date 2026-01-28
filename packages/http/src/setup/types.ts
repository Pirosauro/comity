import type { HttpAdapter } from "../contracts/adapter.js";
import type { HttpMiddleware } from "../contracts/middleware.js";
import type { HttpEvents } from "../lifecycle/events.js";

/**
 * Options for the HTTP module.
 */
export interface HttpModuleOptions {
  /** HTTP adapter to use for handling requests. */
  adapter: HttpAdapter;

  /** Optional middlewares to use for the HTTP pipeline. */
  middlewares?: HttpMiddleware[];

  /** Optional routes to register for the HTTP pipeline. */
  // routes?: HttpRoute[];
}

/**
 * Events emitted by the HTTP module.
 */
export interface HttpModuleEvents {
  /** Event emitted when an HTTP request is started. */
  "@comity/http:request-started": Parameters<HttpEvents["requestStarted"]>[0];

  /** Event emitted when an HTTP request is completed. */
  "@comity/http:request-completed": Parameters<HttpEvents["requestCompleted"]>[0];

  /** Event emitted when an HTTP request fails. */
  "@comity/http:request-failed": Parameters<HttpEvents["requestFailed"]>[0];
}

/**
 * Hooks executed by the HTTP module.
 */
export interface HttpModuleHooks {
  /** Hook executed before an HTTP request is processed. */
  "@comity/http:request-before": Parameters<HttpEvents["requestStarted"]>[0];

  /** Hook executed after an HTTP request is processed. */
  "@comity/http:request-after": Parameters<HttpEvents["requestCompleted"]>[0];
}
