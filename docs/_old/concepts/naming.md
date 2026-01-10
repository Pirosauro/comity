# Comity Naming

## Naming Principles (Authoritative)

1. **Verbs express intent, not implementation**
2. **Configuration ≠ Execution** (different verbs)
3. **Naming must reveal lifecycle** (define → resolve/execute/emit)
4. **Avoid ambiguous verbs** (`get`, `run`, `handle`)
5. **Contracts > convenience** (clarity over brevity)

---

## Naming Example

`@comity/core`

### Decision Matrix

| Module    | Concern             | Verb        | Rationale                             |
| --------- | ------------------- | ----------- | ------------------------------------- |
| Container | Define providers    | `define`    | Declarative, configuration phase      |
| Container | Retrieve service    | `resolve`   | DI semantics, may fail or instantiate |
| HookBus   | Declare hook        | `define`    | Structural capability definition      |
| HookBus   | Execute hook logic  | `execute`   | Deterministic, command-like           |
| EventBus  | Subscribe to events | `subscribe` | Industry standard                     |
| EventBus  | Emit events         | `emit`      | Fire-and-notify semantics             |

---

## Status

This document is **authoritative** and supersedes informal discussions on naming and hook execution semantics.
