# @comity/seo

Reusable SEO abstractions for Comity domain modules.

---

## Purpose

Defines structured SEO metadata models shared by Comity modules. Provides models for metadata formats including Open Graph, Twitter Cards, and Structured Data in a framework-independent way.

---

## Scope

This package:

- ✅ defines OpenGraph, Twitter Card, and structured data models
- ✅ provides a consolidated SeoModel contract

This package does NOT:

- ❌ generate SEO metadata
- ❌ render HTML tags
- ❌ own page or content-level SEO decisions

---

## Public API

- `SeoModel` — generic SEO value model
- `OpenGraphModel` — Open Graph metadata model
- `TwitterCardModel` — Twitter Card metadata model
- `StructuredDataModel` — structured data contract

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/content — page content models
- @comity/html — HTML rendering pipeline

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_