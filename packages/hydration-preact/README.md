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
