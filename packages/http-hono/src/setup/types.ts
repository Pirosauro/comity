import type { HttpFacade } from "@comity/http";

/**
 * Options for creating a Hono handler.
 */
export interface HonoHandlerOptions {
  /**
   * HTTP facade instance.
   *
   * The facade manages the HTTP middleware pipeline.
   */
  readonly facade: HttpFacade;
}

/**
 * Options for the Hono HTTP adapter kernel module.
 */
export interface HttpHonoModuleOptions {
  /**
   * Optional HTTP facade to register in the kernel services.
   *
   * If not provided, the module will not register any services.
   */
  readonly facade?: HttpFacade;
}
