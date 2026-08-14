import type { KernelEventBus, KernelServiceResolver } from "@comity/kernel/setup";
import type { HttpRequest } from "./request.js";

/**
 * HTTP runtime context available during the execution of HTTP handlers, providing access to kernel services and events.
 */
export interface HttpRuntimeContext<
  Services extends Record<keyof Services, unknown> = {},
  Events extends Record<keyof Events, unknown> = {},
> {
  /** Service resolver for accessing kernel services within the HTTP context. */
  readonly services: Pick<KernelServiceResolver<Services>, "resolve">;

  /** Event bus for emitting and subscribing to events within the HTTP context. */
  readonly events: KernelEventBus<Events>;
}

/**
 * HTTP execution context for the entire request lifecycle.
 */
export interface HttpContext<
  State = Record<string, unknown>,
  Services extends Record<keyof Services, unknown> = {},
  Events extends Record<keyof Events, unknown> = {},
> extends HttpRuntimeContext<Services, Events> {
  /** Immutable snapshot of the incoming HTTP request. */
  readonly request: HttpRequest;

  /** Abort signal (client disconnect, timeout, etc.). */
  readonly signal: AbortSignal;

  /** Mutable state for the current request. */
  readonly state: State;
}
