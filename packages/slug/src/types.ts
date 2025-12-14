import type { SlugResultColumns } from "./repositories/slug.js";

/**
 * Configuration options for the Slug module.
 *
 * Provides settings for multi-tenant Slug resolution, caching,
 * and domain mapping behavior.
 */
export type SlugModuleOptions = {
  redirectOnTargetMatch?: boolean;
};

/**
 * Hono context extensions provided by the slug module.
 *
 * Automatically resolves the current slug based on the request domain
 * and provides access to slug data throughout the request lifecycle.
 */
export type SlugModuleHonoContext = {
  Variables: {
    /** The slug associated with the current request */
    slug: Partial<SlugResultColumns>;
  };
};

/**
 * Event payload emitted when the slug module successfully resolves a slug.
 *
 * This event is triggered during middleware setup and can be used by other
 * modules to register slug-specific functionality or perform setup tasks.
 */
export type SlugModuleResolvedEvent = {
  /** The resolved slug for the current request */
  slug: Partial<SlugResultColumns>;
};

/**
 * Events emitted by the slug module.
 *
 * These events allow other modules to react to slug-related
 * actions and access the slug service.
 */
/**
 * Events emitted by the slug module.
 *
 * - `@comity/slug:resolved`: Emitted after a slug is resolved for a request.
 *   Payload: SlugModuleResolvedEvent
 */
export type SlugModuleEvents = {
  /**
   * Emitted after a slug is resolved for a request.
   * Payload: SlugModuleResolvedEvent
   */
  "@comity/slug:resolved": SlugModuleResolvedEvent;
};
