# Comity Coding Standards — Modules

This document defines the **module model** in Comity and clarifies the distinction between
**Application Authors** and **Module Authors**.

Understanding this separation is essential to keep Comity modular, composable, and scalable.

---

## 1. Core Principle

> Not all code in Comity is written for the same audience.

Comity explicitly distinguishes between:

- **Application Authors**
- **Module Authors**

They have **different responsibilities**, **different guarantees**, and **different APIs**.

---

## 2. Application Authors

### Who they are

Application Authors build **applications** using Comity.

They:

- Assemble modules
- Configure the kernel
- Choose adapters (HTTP, runtime, platform)
- Own business logic

---

### What they are allowed to do

Application Authors MAY:

- Instantiate the kernel
- Register modules
- Configure module options
- Listen to lifecycle events
- Provide adapters (HTTP servers, runtimes)

Application Authors SHOULD:

- Treat modules as black boxes
- Rely only on documented public APIs
- Avoid coupling between modules

---

### What they MUST NOT do

Application Authors MUST NOT:

- Reach into module internals
- Call undocumented lifecycle hooks
- Depend on internal types or symbols
- Mutate kernel or module state directly

---

## 3. Module Authors

### Who they are

Module Authors build **reusable functionality** meant to be consumed by applications or other modules.

Examples:

- `@comity/http`
- `@comity/auth`
- `@comity/hydration`

---

### What they are allowed to do

Module Authors MAY:

- Register hooks into the kernel lifecycle
- Emit domain-specific events
- Register services in the DI container
- Depend on `@comity/primitives`
- Depend on `@comity/kernel`

Module Authors SHOULD:

- Declare explicit dependencies
- Declare incompatibilities
- Be deterministic and side-effect aware

---

### What they MUST NOT do

Module Authors MUST NOT:

- Instantiate the kernel
- Control application startup or shutdown
- Assume the presence of other modules
- Depend on adapters (HTTP frameworks, runtimes)
- Perform I/O at import time

---

## 4. Module Metadata Contract

Every module MUST export a **module descriptor**.

Example:

```ts
import type { ModuleMeta } from "@comity/composition/setup";

export const module: ModuleMeta = {
  name: "@comity/http",
  version: "0.9.0",

  dependsOn: {
    "@comity/kernel": { version: "^0.9.0" },
  },
  incompatibleWith: [],

  setup: async (options) => {
    return async (ctx) => {
      // register hooks, services, events
    };
  },
};

export default module;
```

---

## 5. Setup Semantics

- `setup` is executed during kernel initialization
- `setup` MUST be pure (no side effects outside kernel context)
- `setup` MAY register:
  - hooks
  - services
  - event listeners

`setup` MUST NOT:

- start servers
- access environment globals
- assume runtime specifics

---

## 6. Dependency Rules

Modules MUST:

- Explicitly declare dependencies
- Explicitly declare incompatibilities

Modules MUST NOT:

- Rely on implicit load order
- Access services from undeclared dependencies

---

## 7. Public vs Internal APIs

Modules MUST clearly separate:

- **Public API** → documented, stable
- **Internal API** → undocumented, unstable

Only Public APIs may be used by:

- Application Authors
- Other Module Authors

Internal APIs may change without notice.

---

## 8. Events & Hooks in Modules

Modules MAY:

- Emit events to signal behavior
- Register hooks to participate in execution

Modules MUST:

- Treat events as optional
- Treat hooks as contractual

A module MUST continue to function correctly even if no one listens to its events.

---

## 9. Stability Contract

Once published:

- Module public APIs are stable by default
- Lifecycle hooks are stable APIs
- Breaking changes MUST be versioned

---

## Summary

**Application Authors** assemble systems.  
**Module Authors** extend systems.

If a piece of code needs to:

- Control execution → Module Author concern
- Compose behavior → Application Author concern

Keeping this boundary clear is what keeps Comity coherent.
