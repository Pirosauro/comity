# Design Decisions

This document records foundational decisions for `@comity/primitives`.

Only decisions that affect the long-term shape of the package are documented.

---

## Primitives are concept-only

Primitives define semantic contracts, not behavior.

Any API that introduces policy, orchestration, or side effects is excluded.

---

## Lifecycle is a public concept

Lifecycle and event signaling are considered core primitives and exposed
as a single conceptual domain.

Implementation-specific mechanisms are not exposed.

---

## Errors are semantic, not transport-bound

Error primitives may suggest HTTP status codes, but are not HTTP-specific.

They represent semantic failure states and may be reused across environments.

---

## Stability over convenience

Once a primitive is documented as public, it is considered stable by default.

Convenience APIs are intentionally excluded to preserve long-term clarity.