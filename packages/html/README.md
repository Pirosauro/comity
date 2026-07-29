# @comity/html

HTML rendering contracts and document composition for Comity.

---

## Purpose

Provides the core types and pipeline used to describe HTML documents, collect layout metadata, and render structured HTML output without binding to any specific framework.

---

## Scope

This package:

- ✅ defines HTML document, head, layout, and render-result contracts
- ✅ provides the HTML renderer pipeline and default writer utilities
- ✅ exposes the layout collector used by renderers

This package does NOT:

- ❌ load data from repositories
- ❌ bind to a specific view framework
- ❌ implement application business logic

---

## Public API

- Contracts for HTML attributes, document state, head tags, layouts, and render results
- Renderer pipeline primitives
- Default document writer and layout collector

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/http
- @comity/html-preact
- @comity/html-react

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_
