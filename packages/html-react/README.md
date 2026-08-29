# @comity/html-react

React renderer and layout helpers for Comity HTML.

---

## Purpose

Provides React-specific rendering entrypoints that adapt React components into the Comity HTML rendering model. Exposes static and streaming renderers alongside layout helpers.

---

## Scope

This package:

- ✅ renders React output through Comity HTML contracts
- ✅ exposes the `useLayout` helper for React components
- ✅ offers the `streaming` subpath for streaming React rendering

This package does NOT:

- ❌ load data from repositories
- ❌ define HTML document contracts
- ❌ implement application business rules

---

## Public API

- `ReactStaticHtmlRenderer` — entrypoint for static React rendering
- `useLayout` — React hook for layout management
- Streaming renderer utilities (`@comity/html-react/streaming`)

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/html — HTML rendering contracts
- @comity/html-preact — Preact rendering adapter
- @comity/http — HTTP pipeline integration

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_