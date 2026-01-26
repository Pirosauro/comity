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
  services: Pick<DiContainer<Services>, "define" | "resolve">;

  /**
   * Event bus
   */
  events: Pick<EventBus<Events>, "subscribe" | "emit">;

  /**
   * Hook bus
   */
  hooks: Pick<HookBus<Hooks>, "define" | "execute">;
}
