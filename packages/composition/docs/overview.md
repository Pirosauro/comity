# Kernel Overview

The Comity Kernel is a runtime coordinator, not a framework.

core contains architectural primitives that define application structure and orchestration, but no transport or infrastructure concerns.

It provides a shared execution context when multiple modules need:

- lifecycle synchronization
- service registration
- event dispatching
- hook execution

The kernel intentionally avoids:

- auto-discovery
- reflection
- hidden global state
- implicit startup behavior

All orchestration is explicit.

---

## Architectural Position

```
@comity/primitives
        ↓
@comity/kernel   (optional)
        ↓
Application Runtime
        ↓
Adapters / Transports
```

The kernel sits above primitives and below the application.

---

## Core Concepts

- Lifecycle — explicit runtime states.
- Tokens — identity-safe service keys.
- Context — shared execution boundary.
- Events & Hooks — coordination signals.

---

## Design Goals

- Predictability over convenience.
- Explicit orchestration over magic.
- Minimal surface area.
- Long-term stability.

---

## Non-Goals

- Automatic dependency resolution.
- Runtime polymorphism.
- Opinionated application structure.
