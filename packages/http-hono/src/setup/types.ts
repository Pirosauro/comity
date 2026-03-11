import type { ModuleSetupContext } from "@comity/composition";
import type { HonoOptions } from "hono/hono-base";
import type { Hono } from "hono/quick";
import type { BlankEnv, Env } from "hono/types";
import type { HTTP_HONO_TOKEN } from "./constants.js";

/**
 * Options for the Hono HTTP adapter kernel module.
 */
export type HttpHonoModuleOptions<E extends Env = BlankEnv> = HonoOptions<E>;

/**
 * Events emitted by the Hono HTTP adapter kernel module.
 */
export type HttpHonoModuleEvents = {};

/**
 * Hooks provided by the Hono HTTP adapter kernel module.
 */
export type HttpHonoModuleHooks = {
  /** Hook executed during module setup to allow configuration of the Hono HTTP adapter options. */
  "@comity/http-hono:configuring": HttpHonoModuleOptions;

  /** Emitted when the Hono HTTP adapter is initialized */
  "@comity/http-hono:initialized": void;
};

/**
 * Services exposed by the module
 */
export type HttpHonoModuleServices = {
  /** Hono HTTP adapter facade token */
  [HTTP_HONO_TOKEN]: Hono;
};

/**
 * Context provided to the Hono HTTP adapter module setup function.
 */
export interface HttpHonoModuleContext extends ModuleSetupContext<
  HttpHonoModuleServices,
  HttpHonoModuleEvents,
  HttpHonoModuleHooks
> {}
