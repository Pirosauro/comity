# @comity/catalog

Catalog abstractions for Comity domain modules.

---

## Purpose

Defines category, product, inventory, and pricing contracts consumed by storefront and commerce-related modules. Provides repository interfaces and setup tokens for dependency wiring.

---

## Scope

This package:

- ✅ defines repository contracts for categories and products
- ✅ defines catalog models across categories, products, inventory, and pricing
- ✅ exposes setup tokens for repository wiring
- ✅ provides module setup types for composition

This package does NOT:

- ❌ implement query logic or GraphQL specific backends
- ❌ resolve or enrich products
- ❌ render catalog UI at all

---

## Public API

- `CategoryRepository`, `ProductRepository` — repository contracts
- `CategoryModel`, `CategoryHierarchyModel`, `CategoryTreeNodeModel` — category model types
- `ProductModel`, `InventoryModel`, `PriceModel` — product model types
- `CatalogRepositoryContext` — typed repository context
- `CATEGORY_REPOSITORY_TOKEN`, `PRODUCT_REPOSITORY_TOKEN` — DI tokens
- Setup types — module context, events, hooks, and services

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md

---

## Related Packages

- @comity/storefront — page domain composes catalog
- @comity/cart — cart domain depends on catalog
- @comity/search — search criteria models

---

## Status

Stable

_Review Completed: July 25, 2026_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_