# Kernel Events

The `@comity/kernel` package exposes a minimal set of lifecycle events
describing **observable kernel state transitions**.

These events allow application and module authors to react to kernel
milestones without coupling to internal implementation details.

---

## Design Principles

Kernel events follow strict rules:

- They represent **state transitions**, not internal actions
- They are **optional** and have no side effects
- They do not expose execution order or internals
- They are stable once published

If an event is useful only for debugging the kernel, it is not a kernel event.

---

## Kernel States

The kernel transitions through the following states:

- `open` — initial state, modules and services can be registered
- `sealed` — configuration is frozen
- `running` — application is fully initialized
- `stopped` — kernel shutdown completed

Events are emitted only on meaningful transitions.

---

## KernelEvents Interface

```ts
export interface KernelEvents {
  kernelSealed(): void;
  kernelStarted(): void;
  kernelStopped(): void;
}
```

---

## Event Semantics

### `kernelSealed`

Emitted when the kernel transitions from `open` to `sealed`.

At this point:

- module registration is no longer allowed
- service definitions are frozen

This event is useful for validation, logging, or diagnostics.

---

### `kernelStarted`

Emitted when the kernel enters the `running` state.

At this point:

- all modules are initialized
- lifecycle hooks have completed
- the application is ready to serve requests

This is the primary "ready" signal for the system.

---

### `kernelStopped`

Emitted when the kernel transitions to `stopped`.

This is the final lifecycle event and signals that:

- shutdown hooks have completed
- no further work should be scheduled

---

## Non-goals

Kernel events do NOT cover:

- module-level events
- service resolution
- dependency injection
- hook execution
- application or domain events

Those concerns belong to higher-level modules.

---

## Summary

Kernel events provide a **minimal, stable observation layer**
over the kernel lifecycle.

They exist to signal **when** the system reaches a phase,
not **how** it got there.
