# @comity/html-preact

Preact renderers and layout helpers for `@comity/html`.

---

## Purpose

Provides Preact-specific rendering entrypoints that adapt Preact components into the Comity HTML rendering model.

---

## Scope

This package:

- ✅ renders Preact output through Comity HTML contracts
- ✅ exposes the `useLayout` helper
- ✅ provides static and streaming renderer entrypoints

This package does NOT:

- ❌ load data from repositories
- ❌ define HTML document contracts
- ❌ implement application business rules

---

## Public API

- `PreactStaticHtmlRenderer`
- `useLayout`
- streaming renderer entrypoints

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/html
- @comity/http

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_
