# @comity/primitives

Foundational primitives shared across the Comity ecosystem.

---

## Purpose

Defines stable, framework-agnostic building blocks used by Comity packages.
Primitives encode concepts, not implementations.

Provide a common semantic foundation and prevent duplication and drift across modules.

---

## What belongs here

- ✅ Errors and result semantics
- ✅ Event and lifecycle signaling
- ✅ Dependency wiring primitives
- ✅ Small, stable domain-neutral abstractions

---

## What does NOT belong here

- ❌ Framework logic
- ❌ Runtime behavior
- ❌ Helpers, utilities, or convenience APIs
- ❌ Business or domain-specific rules

> If a concept requires contextual explanation or behavioral configuration,
> it does not belong in `@comity/primitives`.

---

## Public API

The public API is intentionally small and disciplined.

API rules and stability guarantees are defined in the documentation.

---

## Documentation

- `docs/overview.md` — scope and intent of primitives
- `docs/conventions.md` — API and design conventions
- `docs/decisions.md`

---

## Status

Stable

_Review Completed: January 25, 2026_
_Reviewer: Hobiri MAGI (Qwen 2.5)_
_Compliance Score: 99.5% (Green)_
