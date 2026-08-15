# @comity/hydration-react

React hydration integration for Comity islands.

---

## Purpose

Bridges the Comity hydration layer with React-based components and runtime helpers. Provides island components, loaders, and registries that implement hydration contracts from `@comity/hydration`.

---

## Scope

This package:

- ✅ defines island components and loader types for React
- ✅ provides a component registry for island resolution
- ✅ exposes the `createHydrationRuntime` factory for React

This package does NOT:

- ❌ define hydration contracts or strategies
- ❌ render static HTML content
- ❌ load application data

---

## Public API

- `Island` — island markup component
- `IslandComponentLoader`, `IslandComponentRegistry` — loader and registry types
- `createHydrationRuntime` — runtime factory for React hydration

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/hydration — hydration contracts and lifecycle
- @comity/html — HTML rendering output

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_