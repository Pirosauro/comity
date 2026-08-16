# @comity/storefront

Generic storefront contracts for Comity.

---

## Purpose

Defines page composers, page models, and context contracts used by storefront applications and adapters. Provides category, content, product, and search page contracts as well as composer contracts and DI tokens.

---

## Scope

This package:

- ✅ defines page composer and enricher contracts
- ✅ defines page model contracts for categories, content, products, and search
- ✅ exposes default page composers implementing the contracts
- ✅ provides setup tokens for composer wiring

This package does NOT:

- ❌ implement data source loading
- ❌ render HTML or UI components
- ❌ execute routing decisions

---

## Public API

- `CategoryPageComposer`, `ContentPageComposer`, `ProductPageComposer`, `SearchPageComposer` — composer contracts
- Corresponds page model contracts and enricher contracts for each page type
- `StorefrontContext`, `StorefrontContextResolver` — context contracts
- `Default*PageComposer` — default implementations
- `CATEGORY_PAGE_COMPOSER_TOKEN` etc. — DI tokens
- Setup types

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/catalog — product and category models
- @comity/search — search criteria models
- @comity/content — page content models

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_