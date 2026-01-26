# Comity Coding Standards — Public API

This document defines **what is allowed to be public** in Comity packages.

Public APIs are **contracts**, not conveniences.

---

## 1. Public API Philosophy

A public API:

- Is intentional
- Is stable
- Can be documented in one paragraph
- Has at least one real consumer

Anything else is **internal**.

---

## 2. Entrypoint Rules

### Root Entrypoint (`@comity/<package>`)

- Aggregates the main public API
- Represents the conceptual identity of the package
- SHOULD be sufficient for most users

### Sub-Entrypoints (`@comity/<package>/*`)

Allowed ONLY if:

1. Represents a clear conceptual domain
2. Is not a technical mechanism
3. Could live as a standalone package
4. Is explicitly documented

❌ Forbidden sub-entrypoint names:

- `utils`
- `helpers`
- `internal`
- `hooks`
- `lazy`

---

## 3. Export Discipline

Every export MUST satisfy all of the following:

- Has a defined responsibility
- Is referenced by documentation
- Has stable semantics
- Is versioned intentionally

❌ Forbidden:

- Placeholder exports
- “Future-proofing” exports
- Empty entrypoints

---

## 4. Internal APIs

Internal APIs:

- MUST NOT be exported
- MUST NOT be documented
- MAY change without notice

Directory convention:

```
internal/
```

If users import from `internal`, that is user error.

---

## 5. Types vs Values

- Types are part of the API
- Types MUST be treated as stable contracts
- Breaking type changes ARE breaking changes

Avoid leaking:

- internal generics
- helper types
- inferred structural types

---

## 6. Facades Are Preferred

If a package exposes behavior:

- Prefer a **Facade**
- Hide orchestration and lifecycle behind it

```ts
interface HttpFacade {
  use(...)
  handle(...)
}
```

Consumers should not assemble pipelines manually unless explicitly intended.

---

## 7. Events & Lifecycle APIs

Lifecycle and events:

- Are public ONLY if consumers can subscribe
- Must be minimal and stable
- Must not leak internal state

Events are part of the API contract.

---

## 8. Breaking Change Policy

The following are BREAKING:

- Removing an export
- Renaming an export
- Changing error codes
- Changing lifecycle semantics

The following are NOT breaking:

- Adding optional fields
- Adding new exports
- Improving documentation

---

## Summary

> If an API needs a warning label, it should not be public.

Public APIs must be boring, predictable, and durable.
