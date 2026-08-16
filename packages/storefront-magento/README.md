# @comity/storefront-magento

Magento GraphQL adapter for @comity/storefront.

---

## Purpose

Connects the storefront core to Magento GraphQL data sources and cached repository implementations. Provides URL rewriting, repository wiring, and module setup for Magento-based storefront applications.

---

## Scope

This package:

- ✅ provides cached and uncached repository implementations for Magento
- ✅ provides a Magento URL rewriter for storefront routing
- ✅ wires repositories into the catalog and cache module contracts
- ✅ defines module setup types and configuration tokens

This package does NOT:

- ❌ define storefront page contracts or composers
- ❌ define catalog or cache contracts
- ❌ own application-level routing policy

---

## Public API

- `setup` subpath — module metadata, setup function, and URL rewriter
- Repositories — cached and raw Magento GraphQL category, product, and routes
- Internal mapping — Magento-specific GraphQL query builders and adapters
- Adapter wiring types — module-level type exports

No exhaustive reference; see docs for constraints.

---

## Documentation

- docs/overview.md
- docs/conventions.md
- docs/architecture.md

---

## Related Packages

- @comity/storefront — storefront page contracts
- @comity/cache — cache contracts and store interfaces
- @comity/graphql-client — GraphQL client transport

---

## Status

Stable

_Review Completed: 2026-07-25_
_Reviewer: Hobiri MAGI (DeepSeek v4 Pro)_
_Compliance Score: 99.5% (Green)_