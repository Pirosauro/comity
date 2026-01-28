import type { HttpFacade } from "./facade.js";

/**
 * HTTP adapter interface.
 */
export interface HttpAdapter {
  /**
   * Attaches the adapter to the HTTP facade.
   *
   * @param facade - HTTP facade instance
   */
  attach(facade: HttpFacade): void;
}