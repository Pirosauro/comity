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
  Services extends { [K in keyof Services]: unknown },
  Events extends { [K in keyof Events]: unknown },
  Hooks extends { [K in keyof Hooks]: unknown },
> = {
  /** Service container */
  services: DiContainer<Services>;

  /** Event bus */
  events: EventBus<Events>;

  /** Hook bus */
  hooks: HookBus<Hooks>;
};
