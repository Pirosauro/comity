# Comity Primitives — Documentation & API Conventions

This document specifies conventions for the `@comity/primitives` package and its public APIs.

---

## Primitives Philosophy

- Primitives represent stable, framework-agnostic concepts.
- They are NOT helpers, utilities, or convenience layers.
- If a concept is unstable, implementation-driven, or context-specific, it does not belong in `@comity/primitives`.

---

## Public API Surface Rules

### Entrypoints

- The root entrypoint (`@comity/primitives`) is the aggregate public API.
- Sub-entrypoints (`@comity/primitives/*`) are explicit, intentional, and rare.

### Sub-entrypoint requirements

A sub-entrypoint MUST satisfy all of the following:

1. Represents a clear conceptual domain, not a technical pattern.
2. Can be explained in one short paragraph.
3. Could theoretically live as a standalone package.
4. Does not depend on runtime, framework, or environment specifics.

If any condition is not met, the API should live in the root entrypoint or remain internal.

---

## Naming Rules

- Names must describe the concept, not the implementation.
- Forbidden sub-entrypoint names: `utils`, `helpers`, `hooks`, `lazy`, `internal`.

If a name describes a mechanism instead of a concept, it is invalid.

---

## Dependency Injection

- DI primitives are allowed only as minimal wiring conventions.
- Avoid reflection, decorators, or lifecycle management in primitives.
- If DI grows in complexity, it must move to a dedicated package.

---

## Errors & Results

- Error primitives must be shape-only (no side effects, logging, or transport concerns).
- Errors may be public only if semantically complete for consumers.

---

## Stability Contract

- Once documented as public, APIs are stable by default.
- Breaking changes require explicit justification.
- Internal APIs are never documented.

---

## Summary

If an API needs explanation beyond its concept, it is not a primitive.

---

## Error Default Messages

All public error primitives MUST define a default human-readable message.

The default message represents the **semantic meaning of the error**, not a specific use case.

### Mandatory rules

Default messages MUST be:

- **Neutral**  
  They describe a state or condition, not an action or a failure cause.

- **Domain-agnostic**  
  They must not reference HTTP, UI, persistence, users, requests, or infrastructure.

- **Blame-free**  
  No wording that implies fault or responsibility (e.g. “you cannot”, “failed to”, “not allowed to”).

- **Context-independent**  
  The message must make sense even without knowing where the error originated.

- **Short and declarative**  
  Prefer simple statements over explanations.

### Forbidden patterns

Default messages MUST NOT:

- Mention transport concepts (HTTP, request, response, status code)
- Mention implementation details (API, database, server, client)
- Encode business logic or domain rules
- Include remediation instructions

### Examples

**Good**

- `"Invalid input"`
- `"Access denied"`
- `"Resource not found"`
- `"Operation conflicts with current state"`
- `"Operation timed out"`

**Bad**

- `"Bad request"`
- `"User is not authorized"`
- `"Cannot update entity"`
- `"Request timed out"`
- `"Conflict while saving"`

### Custom messages

Consumers MAY override the default message when throwing an error to provide
context-specific or user-facing explanations.

The default message MUST remain generic and stable.