import type { DiContainer } from "@comity/primitives/di";
import type { EventBus, HookBus } from "@comity/primitives/lifecycle";

/**
 * Token type.
 */
export type Token<T extends string> = symbol & {
  /** Token type string */
  __type?: T;
};

/**
 * Kernel context.
 */
export type KernelContext<
  Services extends Record<keyof Services, unknown>,
  Events extends Record<keyof Events, unknown>,
  Hooks extends Record<keyof Hooks, unknown>,
> = {
  /** Service container */
  services: DiContainer<Services>;

  /** Event bus */
  events: EventBus<Events>;

  /** Hook bus */
  hooks: HookBus<Hooks>;
};
