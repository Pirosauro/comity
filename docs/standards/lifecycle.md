# Comity Coding Standards — Lifecycle

This document defines the **Lifecycle model** used across Comity packages and clarifies the
**difference between Events and Hooks**, when to use each, and why both exist.

---

## 1. What Is Lifecycle in Comity

Lifecycle represents **well-defined phases** in the existence of a system or module.

Examples:

- Kernel boot → running → stopped
- HTTP pipeline open → sealed → running
- Module registration → setup → active

Lifecycle is about **state transitions**, not data flow.

---

## 2. Lifecycle States

Lifecycle states are:

- Explicit
- Finite
- Monotonic (no implicit rollback)

Example:

```ts
export type KernelState = "open" | "sealed" | "running" | "stopped";
```

Rules:

- States MUST be enumerable
- Transitions MUST be explicit
- Invalid transitions MUST fail fast

---

## 3. Lifecycle Controller

Lifecycle state is managed by a **single owner**, usually:

- Kernel
- Facade
- Runtime

Lifecycle MUST NOT be:

- Distributed
- Mutable by external consumers

---

## 4. Hooks vs Events — Core Distinction

This is **critical**.

### Events

Events describe **something that already happened**.

- Fire-and-forget
- Non-blocking
- Side-effect free
- Optional

Events are **observational**.

Example:

```ts
kernelStarted(...)
requestCompleted(...)
```

If no one listens, nothing breaks.

---

### Hooks

Hooks allow **controlled extension of behavior**.

- Executed synchronously or asynchronously
- Ordered
- Allowed to influence execution
- Part of the lifecycle contract

Hooks are **participatory**.

Example:

```ts
onKernelSetup;
onRequest;
beforeResponse;
```

If hooks are not executed, behavior is incomplete.

---

## 5. When to Use Events

Use **Events** when:

- You want to observe behavior
- You want logging, metrics, tracing
- You want external modules to react
- You do NOT want control flow changes

Examples:

- Request completed
- Module registered
- Kernel stopped

---

## 6. When to Use Hooks

Use **Hooks** when:

- You want to allow extension
- Order matters
- Execution can be modified
- A module participates in execution

Examples:

- Middleware pipelines
- Module setup
- Authorization checks
- Request interception

---

## 7. Decision Table

| Use Case          | Events | Hooks |
| ----------------- | ------ | ----- |
| Logging           | ✅     | ❌    |
| Metrics           | ✅     | ❌    |
| Tracing           | ✅     | ❌    |
| Middleware        | ❌     | ✅    |
| Authorization     | ❌     | ✅    |
| Observability     | ✅     | ❌    |
| Control flow      | ❌     | ✅    |
| Optional behavior | ✅     | ❌    |
| Required behavior | ❌     | ✅    |

---

## 8. Interaction Rules

- Hooks MAY emit events
- Events MUST NOT trigger hooks
- Hooks MUST NOT depend on events

Correct:

```ts
hook() {
  doWork();
  emitEvent();
}
```

Incorrect:

```ts
onEvent(() => {
  changeBehavior();
});
```

---

## 9. Kernel Responsibility

The Kernel:

- Owns lifecycle state
- Executes hooks
- Emits lifecycle events

Modules:

- Register hooks
- Listen to events

---

## 10. Stability Rules

- Lifecycle phases are public API
- Hook names are public API
- Event payloads are public API

Changing lifecycle semantics is a **breaking change**.

---

## Summary

> Events observe.  
> Hooks participate.

If you are unsure which one to use, ask:

**“Should this be allowed to change behavior?”**

If yes → Hook  
If no → Event
