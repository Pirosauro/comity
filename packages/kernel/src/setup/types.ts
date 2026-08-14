import type { DiContainer } from "@comity/primitives/di";
import type { EventBus, HookBus } from "@comity/primitives/lifecycle";

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

/**
 * Kernel service resolver.
 */
export type KernelServiceResolver<Services extends Record<keyof Services, unknown>> = {
  /** Define a service */
  define: DiContainer<Services>["define"];

  /** Resolve a service */
  resolve: DiContainer<Services>["resolve"];

  /** Clear cached instances */
  clear: DiContainer<Services>["clear"];
};

/**
 * Kernel event bus.
 */
export type KernelEventBus<Events extends Record<keyof Events, unknown>> = {
  /** Subscribe to an event */
  subscribe: EventBus<Events>["subscribe"];

  /** Unsubscribe from an event */
  unsubscribe: EventBus<Events>["unsubscribe"];

  /** Emit an event */
  emit: EventBus<Events>["emit"];
};

/**
 * Kernel hook bus.
 */
export type KernelHookBus<Hooks extends Record<keyof Hooks, unknown>> = {
  /** Define a hook */
  define: HookBus<Hooks>["define"];

  /** Execute a hook */
  execute: HookBus<Hooks>["execute"];
};