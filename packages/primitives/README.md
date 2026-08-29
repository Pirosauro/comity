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

- Dependency injection — minimal container for service wiring (`@comity/primitives/di`)
- Error primitives — BaseError and concrete error types (`@comity/primitives/errors`)
- Lifecycle — EventBus and HookBus contracts and implementations (`@comity/primitives/lifecycle`)
- Result — success/failure factories and contracts (`@comity/primitives/result`)
- Time — Instant and temporal primitives (`@comity/primitives/time`)

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
- @comity/html
- @comity/auth

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_
