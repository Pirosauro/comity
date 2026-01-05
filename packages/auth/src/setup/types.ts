import type { AuthOrchestrator } from "../application/orchestrator.js";
import type { AuthContext } from "../ports/context.js";

/**
 * Hooks exposed by the auth module.
 *
 * Hooks are emitted during module lifecycle and allow other modules
 * to obtain references to auth primitives.
 */
export type AuthModuleHooks = {
  /**
   * Emitted once the auth module is fully initialized.
   *
   * Provides the AuthOrchestrator instance.
   */
  "@comity/auth:initialized": AuthOrchestrator<any, any, any, any>;
};

/**
 * Events emitted by the auth module.
 *
 * These events describe authentication outcomes, not transport details.
 */
export type AuthModuleEvents = {
  /**
   * Emitted when authentication succeeds.
   */
  "@comity/auth:authorized": {
    context: AuthContext;
    timestamp: number;
  };

  /**
   * Emitted when authentication fails.
   */
  "@comity/auth:authorization-failed": {
    reason: string;
    timestamp: number;
  };

  /**
   * Emitted when a session refresh succeeds.
   */
  "@comity/auth:refreshed": {
    context: AuthContext;
    timestamp: number;
  };

  /**
   * Emitted when a session refresh fails.
   */
  "@comity/auth:refresh-failed": {
    reason: string;
    timestamp: number;
  };
};

/**
 * Context injected by the auth module.
 */
export type AuthModuleContext = {
  auth: AuthOrchestrator<any, any, any, any>;
};

/**
 * Auth module setup options.
 *
 * This module is orchestration-only: all adapters must be provided.
 */
export interface AuthModuleOptions<
  R,
  I extends Record<string, unknown>,
  S extends Record<string, unknown>,
  E extends string
> {
  orchestrator: AuthOrchestrator<R, I, S, E>;
}
