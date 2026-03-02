# @comity/primitives

Foundational primitives shared across the Comity ecosystem.

---

## Purpose

Defines stable, framework-agnostic building blocks used across Comity packages to prevent duplication and drift. Primitives encode concepts, not implementations.

---

## Scope

This package:

- ✅ provides error primitives and result semantics
- ✅ exposes lifecycle signaling via events and hooks
- ✅ offers minimal dependency wiring primitives

This package does NOT:

- ❌ include framework/runtime behavior
- ❌ provide helpers, utilities, or convenience APIs
- ❌ encode business or domain-specific rules

---

## Public API

Disciplined, concept-first surface divided into domains:

- errors: BaseError and concrete error types
- lifecycle: EventBus and HookBus contracts and implementations
- di: minimal container for service wiring
- result: success/failure factories and contracts

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/decisions/

---

## Related Packages

- @comity/kernel
- @comity/http
- @comity/html-runtime
- @comity/auth

---

## Status

Stable

_Review Completed: January 25, 2026_
_Reviewer: Hobiri MAGI (Qwen 2.5)_
_Compliance Score: 99.5% (Green)_
