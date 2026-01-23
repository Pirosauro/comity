# Primitives Overview

`@comity/primitives` defines the semantic foundation of the Comity ecosystem.

It is not a shared utilities package.
It is a collection of stable concepts that multiple modules depend on.

---

## Intent

The goal of this package is to:

- Avoid duplication of core concepts
- Ensure consistent semantics across packages
- Provide stable contracts that rarely change

Primitives should feel boring, predictable, and obvious.

---

## When to add something here

A concept MAY be added to `@comity/primitives` only if all of the following
are true:

- It is required by multiple packages
- It has a clear, stable definition
- It is framework-agnostic
- It does not depend on runtime or environment
- It can be explained without examples

If a concept is still evolving, it is not a primitive.

---

## When NOT to add something

Do NOT add a concept if:

- It solves a local or temporary problem
- It introduces behavior, policy, or orchestration
- It depends on lifecycle management or side effects
- It primarily exists for convenience

In those cases, the concept belongs in a higher-level package.

---

## Design principle

If an API needs explanation beyond its concept,
it is not a primitive.