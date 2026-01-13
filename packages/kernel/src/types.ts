import type { DiContainer } from "@comity/core/di";
import type { EventBus } from "@comity/core/events";
import type { HookBus } from "@comity/core/hooks";

/**
 * Token type
 */
export type Token<T extends string> = symbol & {
  /** Token type string */
  __type?: T;
};

/**
 * Kernel state type
 */
export type KernelState = "open" | "sealed" | "running" | "stopped";

/**
 * Module setup context type
 */
export interface ModuleSetupContext<
  Services extends Record<string | symbol, unknown> = Record<
    string | symbol,
    unknown
  >,
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
