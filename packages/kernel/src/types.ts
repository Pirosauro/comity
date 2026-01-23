import type { DiContainer } from "@comity/primitives/di";
import type { EventBus, HookBus } from "@comity/primitives/lifecycle";

/**
 * Token type
 */
export type Token<T extends string> = symbol & {
  /** Token type string */
  __type?: T;
};

/**
 * Module setup context type
 */
export interface ModuleSetupContext<
  Services extends Record<symbol, unknown> = Record<symbol, unknown>,
  Events extends Record<string, unknown> = Record<string, unknown>,
  Hooks extends Record<string, unknown> = Record<string, unknown>,
> {
  /**
   * Services container
   */
  services: Omit<DiContainer<Services>, "#private">;

  /**
   * Event bus
   */
  events: Omit<EventBus<Events>, "#private">;

  /**
   * Hook bus
   */
  hooks: Omit<HookBus<Hooks>, "#private">;
}
