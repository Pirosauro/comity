# @comity/hydration-preact

Preact hydration adapter for Comity islands.

---

## Purpose

Provides the Preact-specific runtime used to hydrate Comity islands through the `@comity/hydration` contracts.

---

## Scope

This package:

- ✅ exposes the island component and registry types
- ✅ provides a Preact hydration runtime
- ✅ adapts hydration behavior to Preact

This package does NOT:

- ❌ define hydration contracts
- ❌ own hydration strategies
- ❌ load application data

---

## Public API

- `Island`
- `IslandComponentLoader`
- `IslandComponentRegistry`
- `createHydrationRuntime`

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/hydration
- @comity/primitives

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_
