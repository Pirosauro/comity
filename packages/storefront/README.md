# @comity/storefront

Storefront page composition capability module for Comity.

---

## Purpose

Provides reusable page composition capabilities for storefront applications. Defines page composer and enricher contracts, page models for categories, content, products, and search, and default composer implementations.

---

## Scope

This package:

- ✅ defines page composer and enricher contracts
- ✅ defines page model contracts for categories, content, products, and search
- ✅ exposes default page composers implementing the contracts
- ✅ provides setup tokens for composer wiring
- ✅ provides `StorefrontContext` and `StorefrontContextResolver` for locale/currency/tenant resolution

This package does NOT:

- ❌ implement checkout orchestration or workflows
- ❌ implement payment, inventory, order, or pricing operations
- ❌ implement customer or address loading
- ❌ implement application-level security concepts (Principal, Permission, Scope)
- ❌ render HTML or UI components
- ❌ execute routing decisions

---

## Public API

- Page composer contracts — category, content, product, and search page composers
- Page model contracts — corresponding models and enrichers for each page type
- Context contracts — storefront context and resolver interfaces
- Default composers — canonical composer implementations
- Setup — kernel module metadata, DI tokens, and wiring (`@comity/storefront/setup`)
- Errors — storefront error types (`@comity/storefront/errors`)

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
- @comity/taxonomy — category taxonomy models

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_