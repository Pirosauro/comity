# @comity/content

Content contracts for Comity page and block models.

---

## Purpose

Defines the contracts used to describe pages, blocks, navigation, and repository context for content-driven modules.

---

## Scope

This package:

- ✅ defines page and block contracts
- ✅ exposes repository context for content loaders
- ✅ provides setup tokens for repository wiring

This package does NOT:

- ❌ render HTML
- ❌ load content from a specific backend
- ❌ own application routing or presentation

---

## Public API

- Page, block, breadcrumb, and navigation contracts
- Repository context contract
- Repository tokens
- Setup — module metadata and repository wiring (`@comity/content/setup`)

No exhaustive reference; see docs for constraints.
---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/media
- @comity/search
- @comity/seo

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_
